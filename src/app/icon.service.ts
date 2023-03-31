import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

interface CollectionItem {
  id: string;
  loading: boolean;
  loaded: boolean;
};

export interface Icon {
  requestId: string;
  id: string,
  data: string
}

interface requestQueue {
  icon: string;
  requestId: string;
}

@Injectable({
  providedIn: 'root'
})
export class IconService {
  iconList: Map<string, string> = new Map();
  collections: CollectionItem[] = [];

  iconSubject$: Subject<Icon> = new Subject();
  iconRequests: requestQueue[] = [];

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

  getIconData() {
    return this.iconSubject$.asObservable();
  }

  getIcon(icon: string, requestId: string): void {
    if (this.iconList.has(icon)) {
      this.iconSubject$.next({
        requestId,
        id: icon,
        data: <string>this.iconList.get(icon) 
      });
    } else {
      this.iconRequests.push({
        icon,
        requestId
      });
      this.loadIconCollection(icon);
    }
  }

  loadIconCollection(icon: string) {
    const idCollection = icon.split('-')[0];
    const collectionInfoIndex = this.collections.findIndex(c => c.id === idCollection);

    if (collectionInfoIndex < 0) {
      return;
    }

    if (!this.collections[collectionInfoIndex].loading &&
      !this.collections[collectionInfoIndex].loaded) {

      this.collections[collectionInfoIndex].loading = true;
      this.http.get(`/assets/iconos/${idCollection}.json`).subscribe(data => {
        (data as Icon[]).forEach(item => {
          this.iconList.set(item.id, item.data);
        });
        this.collections[collectionInfoIndex].loading = false;
        this.collections[collectionInfoIndex].loaded = true;

        this.dispatchRequestedIcons();
      });

    }
  }

  dispatchRequestedIcons() {
    this.iconRequests.forEach(request => {
      const idCollection = request.icon.split('-')[0];

      const collectionInfoIndex = this.collections.findIndex(c => c.id === idCollection);

      if (collectionInfoIndex < 0) {
        return;
      }

      if (this.collections[collectionInfoIndex].loaded) {
        this.iconSubject$.next({
          requestId: request.requestId,
          id: request.icon,
          data: <string>this.iconList.get(request.icon.split('-').slice(1).join('-'))
        });
      }
    });
  }
}