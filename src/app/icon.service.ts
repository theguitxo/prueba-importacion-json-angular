import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

interface CollectionItem {
  id: string;
  loading: boolean;
  loaded: boolean;
};

export interface Icon {
  requestId: string;
  id: string;
  data: string;
}

interface RequestQueue {
  icon: string;
  requestId: string;
  dispatched: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class IconService {
  iconList: Map<string, string> = new Map();
  collections: CollectionItem[] = [];

  iconSubject$: Subject<Icon> = new Subject();
  iconRequests: RequestQueue[] = [];

  loadAllCollections$: Subject<boolean> = new Subject();

  constructor(
    private readonly http: HttpClient
  ) {
    this.collections = [
      {
        id: 'arrow',
        loaded: false,
        loading: false
      },
      {
        id: 'cursor',
        loaded: false,
        loading: false
      },
      {
        id: 'file',
        loaded: false,
        loading: false
      },
      {
        id: 'money',
        loaded: false,
        loading: false
      }
    ];
  }

  getIconData(): Observable<Icon> {
    return this.iconSubject$.asObservable();
  }

  getLoadAllCollections(): Observable<boolean> {
    return this.loadAllCollections$.asObservable();
  }

  getAllIdCollections(): string[] {
    return this.collections.map(m => m.id);
  }

  getCollectionIcons(collection: string): string[] {
    let icons: string[] = [];
    this.iconList.forEach((icon, index) => {
      if (index.startsWith(collection)) {
        icons.push(icon);
      }
    });
    return icons;
  }

  getCollectionIconsIds(collection: string): string[] {
    let icons: string[] = [];
    this.iconList.forEach((_icon, index) => {
      if (index.startsWith(collection)) {
        icons.push(index);
      }
    });
    return icons;
  }

  getIcon(icon: string, requestId: string): void {
    if (this.iconList.has(icon)) {
      this.sendIconData(requestId, icon, <string>this.iconList.get(icon));
    } else {
      this.iconRequests.push({
        icon,
        requestId,
        dispatched: false
      });
      this.loadIconCollection(icon);
    }
  }

  loadIconCollection(icon: string): void {
    const idCollection = this.getIdCollection(icon);
    const collection = this.getCollection(icon);
    if (!!collection && !collection.loading && !collection.loaded) {
      collection.loading = true;
      this.http.get(`/assets/iconos/${idCollection}.json`).subscribe(data => {
        this.fillCollectionItem(data as Icon[], collection);
        this.dispatchRequestedIcons();
      });

      this.iconRequests = this.iconRequests.filter(i => !i.dispatched);
    }
  }

  dispatchRequestedIcons(): void {
    this.iconRequests.forEach(request => {
      const collection = this.getCollection(request.icon);
      if (!!collection && collection.loaded) {
        this.sendIconData(
          request.requestId,
          request.icon,
          <string>this.iconList.get(request.icon)
        );
      }
    });
  }

  getIdCollection(icon: string): string {
    return icon.split('-')[0];
  }

  getCollection(icon: string): CollectionItem | null {
    const idCollection = this.getIdCollection(icon);
    const collectionInfoIndex = this.collections.findIndex(c => c.id === idCollection);
    return collectionInfoIndex < 0 ? null : this.collections[collectionInfoIndex];
  }

  sendIconData(requestId: string, id: string, data: string) {
    return this.iconSubject$.next({
      requestId, id, data
    });
  }

  fillCollectionItem(data: Icon[], collection: CollectionItem): void {
    data.forEach(item => {
      this.iconList.set(`${collection.id}-${item.id}`, item.data);
    });
    collection.loading = false;
    collection.loaded = true;
  }

  loadCollections() {
    const collectionsToLoad = this.collections.filter(i => !i.loaded);
    const totalCollectionsToLoad = collectionsToLoad.length;

    if (totalCollectionsToLoad) {
      let collectionsLoaded = 0;
      collectionsToLoad.forEach(collection => {
        this.http.get(`/assets/iconos/${collection.id}.json`).subscribe(data => {
          this.fillCollectionItem(data as Icon[], collection);
          collectionsLoaded++;
          if (collectionsLoaded === totalCollectionsToLoad) {
            this.loadAllCollections$.next(true);
            this.loadAllCollections$.complete();
          }
        })
      });
    } else {
      this.loadAllCollections$.next(true);
      this.loadAllCollections$.complete();
    }
  }
}
