import {Location} from '@angular/common';

export abstract class AbstractMenuEntryCommand {

    public abstract onMenuEntryClick(location: Location): any[];

}
