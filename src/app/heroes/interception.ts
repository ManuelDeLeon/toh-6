import { Injectable, Component } from "@angular/core";

interface Type<T> {
  new(...args): T;
}

interface Base { }

interface Identifiable { }

export function IdentifiableSubclass<T extends Base>(SuperClass: Type<T>) {
  @Injectable()
  class C extends (<Type<Base>>SuperClass) {
    constructor(...args) {
      super(...args);
      return new Proxy(this, {
        get(target, name) {
          console.log(name);
          return target[name];
        }
      });
    }
  }
  return <Type<Identifiable & T>>C;
}
