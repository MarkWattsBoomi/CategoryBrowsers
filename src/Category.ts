import { FlowObjectData, FlowObjectDataArray } from "flow-component-model";

export class CategoryConfig {
    idColumn: string;
    idSepCharacter: string;
    lvl1Column: string;
    lvl2Column: string;
    lvl3Column: string;
}

export class Categories {
    items: Map<string,Category>
    conf: CategoryConfig;

    constructor() {
        this.items = new Map();
    }

    public static parse(items: FlowObjectDataArray, conf: CategoryConfig) : Categories {
        let cats: Categories = new Categories();
        cats.conf = conf;
        let orphans: Array<Category> = [];
        items.items.forEach((item: FlowObjectData) => {
            let cat: Category = Category.parse(item, conf);
            orphans.push(cat);
        });

        let loops: number = 3;

        while(orphans.length > 0 && loops > 0) {
            for(let pos = 0 ; pos < orphans.length ; pos++) {
                if(orphans[pos]) {
                    let bits: string[] = orphans[pos].id.split(conf.idSepCharacter);
                    if(bits.length === 1) {
                        cats.add(bits[0],orphans[pos]);
                        orphans[pos]=null;
                    }
                    else {
                        if(cats.items.has(bits[0])) {
                            if(cats.items.get(bits[0]).home(orphans[pos], conf) === true) {
                                orphans[pos]=null;
                            }
                        }
                    }
                }
            }
            //remove done
            for(let pos = orphans.length -1 ; pos >= 0 ; pos--) {
                if(orphans[pos] === null) {
                    orphans.splice(pos, 1);
                }
            }
            loops--;
        }

        

        return cats;
    }

    private add(id: string, cat: Category) {
        this.items.set(id, cat);
    }

    getById(id: string) : Category {
        let cat: Category;
        if(id && id !== "???") {
            
            let bits: string[] = id.split("-");
            if(this.items.has(bits[0])){
                cat=this.items.get(bits[0]).getById(id, id);
            }
        }
        else {
            cat = new Category();
            cat.id = "???";
            cat.title = "Clear";
            cat.objectData = null;
        }
        return cat;
    }
}

export class Category {
    id: string;
    title: string;
    parent: Category;
    children: Map<string, Category>;
    objectData: FlowObjectData;

    constructor() {
        this.children = new Map();
    }

    public static parse(item: FlowObjectData, conf: CategoryConfig) : Category {
        let cat: Category = new Category();
        cat.objectData = item;
        cat.id = item.properties[conf.idColumn]?.value as string;
        cat.title = item.properties[conf.lvl3Column]?.value as string || item.properties[conf.lvl2Column]?.value as string || item.properties[conf.lvl1Column]?.value as string;
        return cat;
    }

    home(cat: Category, conf: CategoryConfig): boolean {
        if(cat.id.startsWith(this.id)) {
            let chld: string = cat.id.substring(this.id.length + 1);
            let bits: string[] = chld.split(conf.idSepCharacter);
            if(bits.length===1) {
                if(!this.children.has(bits[0])) {
                    cat.parent = this;
                    this.children.set(bits[0], cat);
                }
                return true;
            }
            else {
                if(this.children.has(bits[0])) {
                    if(this.children.get(bits[0]).home(cat, conf) === true){
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
        }
        else {
            return false;
        }
        
        
    }

    getById(id: string, fullId: string) : Category {
        if(this.id === fullId) {
            return this;
        }
        else {
            let newid = id.substring(4);
            let bits: string[] = newid.split("-");
            if(this.children.has(bits[0])){
                return this.children.get(bits[0]).getById(newid, fullId);
            }
        }
    }

}