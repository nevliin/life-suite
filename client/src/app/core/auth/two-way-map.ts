export class TwoWayMap<A, B>{

  map: Map<A, B>;
  reverseMap: Map<B, A>;

  constructor(map: Map<A, B>){
    this.map = map;
    this.reverseMap = new Map();
    Array.from(map.keys()).forEach(key => {
        this.reverseMap.set(map.get(key), key);
    });
  }
  get(key: A) { return this.map.get(key); }
  revGet(key: B) { return this.reverseMap.get(key); }
}
