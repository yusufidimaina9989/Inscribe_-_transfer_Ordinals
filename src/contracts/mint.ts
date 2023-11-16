import { method, prop, assert, Addr, Utils } from "scrypt-ts";
import { OrdinalNFT } from "scrypt-ord";

export class DemoNFT extends OrdinalNFT {
  @prop()
  x: bigint;
  @prop()
  y: bigint;

  constructor(x: bigint, y: bigint) {
    super();
    this.init(...arguments);
    this.x = x;
    this.y = y;
  }

  @method()
  public unlock(z: bigint) {
    assert(z == this.x + this.y, "incorrect sum");
  }
}