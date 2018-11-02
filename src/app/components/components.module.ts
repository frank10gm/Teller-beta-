import { IonicModule } from "@ionic/angular";
import { PostCardComponent } from "./post-card/post-card.component";
import { NgModule } from "@angular/core";

@NgModule({
	declarations: [
    PostCardComponent
  ],
	imports: [
    IonicModule
  ],
	exports: [
    PostCardComponent
  ]
})
export class ComponentsModule {}