import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  imports: [
    AppModule,
    ServerModule
  ],
  providers: [
    provideHttpClient()
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
