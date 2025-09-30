import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(
            BrowserAnimationsModule,
            HttpClientModule,
            RouterModule.forRoot([])
        )
    ]
})
    .catch((err: any) => console.error(err));