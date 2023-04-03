export function AutoDestroy(component: any, key: string | symbol): void {
  const originalDestroy = component.ngOnDestroy;

  component.ngOnDestroy = function () {
    if (originalDestroy) {
      originalDestroy.call(this);
    }
    this[key].next();
    this[key].complete();
  }
}
