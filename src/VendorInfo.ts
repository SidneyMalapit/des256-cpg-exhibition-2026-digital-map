interface VInfo {
  id: number;
  name: string;
  handle: string;
  link: string | undefined;
  description: string;
}

export default class VendorInfo implements VInfo {
  public readonly id: number;
  public readonly name: string;
  public readonly handle: string;
  public readonly link: string | undefined;
  public readonly description: string;

  constructor(info: VInfo) {
    this.id = info.id;
    this.name = info.name;
    this.handle = info.handle;
    this.link = info.link;
    this.description = info.description;
  }
}
