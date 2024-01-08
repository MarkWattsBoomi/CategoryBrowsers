import { FlowObjectData, FlowObjectDataArray } from "flow-component-model";

export class CategoryConfig {
    idColumn: string;
    idSepCharacter: string;
    lvl1Column: string;
    lvl2Column: string;
    lvl3Column: string;
    enabledColumn: string;
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
                            if(cats.items.get(bits[0]).home(orphans[pos]) === true) {
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
            
            let bits: string[] = id.split(this.conf.idSepCharacter);
            if(this.items.has(bits[0])){
                cat=this.items.get(bits[0]).getById(id, id);
            }
        }
        else {
            cat = new Category();
            cat.id = "???";
            cat.title = "Clear";
            cat.objectData = null;
            cat.conf = this.conf;
        }
        return cat;
    }

    getSortedItems() : Array<Category> {
        //sort by ignoring the item's key
        let sorted: Array<Category> = Array.from(this.items.values());
        sorted.sort((a,b) => {
            if(a.title.replace(a.id,"") > b.title.replace(b.id,"")) return 1;
            if(a.title.replace(a.id,"") < b.title.replace(b.id,"")) return -1;
            return 0;
        });
        return sorted;
    }
}

export class Category {
    id: string;
    title: string;
    parent: Category;
    children: Map<string, Category>;
    objectData: FlowObjectData;
    conf: CategoryConfig;
    enabled: boolean;

    constructor() {
        this.children = new Map();
    }

    public static parse(item: FlowObjectData, conf: CategoryConfig) : Category {
        let cat: Category = new Category();
        cat.conf = conf;
        cat.objectData = item;
        cat.id = item.properties[cat.conf.idColumn]?.value as string;
        cat.title = item.properties[cat.conf.lvl3Column]?.value as string || item.properties[cat.conf.lvl2Column]?.value as string || item.properties[cat.conf.lvl1Column]?.value as string;
        cat.enabled = ("" + (item.properties[cat.conf.enabledColumn]?.value as string)?.toLowerCase() === "no")? false : true;
        if(!cat.conf){
            console.log("ping");
        }
        return cat;
    }

    home(cat: Category): boolean {
        if(cat.id.startsWith(this.id)) {
            let chld: string = cat.id.substring(this.id.length + 1);
            let bits: string[] = chld.split(this.conf.idSepCharacter);
            if(bits.length===1) {
                if(!this.children.has(bits[0])) {
                    cat.parent = this;
                    this.children.set(bits[0], cat);
                }
                return true;
            }
            else {
                if(this.children.has(bits[0])) {
                    if(this.children.get(bits[0]).home(cat) === true){
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
            let newid = id.substring(id.indexOf(this.conf.idSepCharacter)+1);
            let bits: string[] = newid.split(this.conf.idSepCharacter);
            if(this.children.has(bits[0])){
                return this.children.get(bits[0]).getById(newid, fullId);
            }
        }
    }

    getSortedItems() : Array<Category> {
        //sort by ignoring the item's key
        let sorted: Array<Category> = Array.from(this.children.values());
        let sep: string = this.conf.idSepCharacter;
        sorted.sort((a,b) => {
            let aPre: string = a.id.substring(a.id.lastIndexOf(sep)).replace(sep,"");
            let bPre: string = b.id.substring(b.id.lastIndexOf(sep)).replace(sep,"");
            if(a.title > b.title) {
                return 1;
            }
            if(a.title < b.title) {
                return -1;
            }
            return 0;
        });
        return sorted;
    }

}