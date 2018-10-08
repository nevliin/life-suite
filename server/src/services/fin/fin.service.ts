import {OkPacket, RowDataPacket} from "mysql";
import {DbUtil} from "../../utils/db/db.util";
import {CategoryAddModel, CategoryUpdateModel} from "./category.model";

export class FinService {

    db: DbUtil;

    constructor() {
        this.db = new DbUtil();
    }

    /**
     * Add new category for accounts; returns the ID assigned to the category
     * @param categoryAddModel
     */
    async addCategory(categoryAddModel: CategoryAddModel): Promise<number> {
        const result: OkPacket = await this.db.execute(`INSERT INTO fin_category(name, active) VALUES('${this.db.esc(categoryAddModel.name)}', ${Number(categoryAddModel.active)});`);
        return result.insertId;
    }

    /**
     * Update an existing category for accounts, identified by the unique ID; returns the ID assigned to the category
     * @param categoryUpdateModel
     */
    async updateCategory(categoryUpdateModel: CategoryUpdateModel): Promise<number> {
        const result: OkPacket = await this.db.execute(
            `UPDATE fin_category
            SET name = '${this.db.esc(categoryUpdateModel.name)}', active = ${Number(categoryUpdateModel.active)} 
            WHERE id = ${categoryUpdateModel.id});`);
        return result.insertId;
    }

}