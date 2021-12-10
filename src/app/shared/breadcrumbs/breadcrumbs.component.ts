import { map } from 'rxjs/operators';
import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [],
})
export class BreadcrumbsComponent implements OnDestroy {
  subs$: Subscription;
  titulo: string = '';

  constructor(private router: Router) {
    this.subs$ = this.getArgumentosRuta()
      .subscribe(({ title }) => {
        console.log(title);
        this.titulo = title;
        document.title = `Admin Pro - ${title}`;
      });
  }

  ngOnDestroy(): void {
    this.subs$.unsubscribe();
  }

  private getArgumentosRuta() {
    return this.router.events
      .pipe(
        filter((event) => event instanceof ActivationEnd),
        filter((event: any) => event.snapshot.firstChild === null),
        map((event) => event.snapshot.data)
      );
  }
}
