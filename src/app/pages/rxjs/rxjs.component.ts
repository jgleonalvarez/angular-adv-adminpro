import { Component, OnDestroy } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { retry, take, map, filter } from "rxjs/operators";

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [],
})
export class RxjsComponent implements OnDestroy {

  subs: Subscription;

  constructor() {

    // this.retornaObservable()
    //   .pipe(
    //     retry(2)
    //   )
    //   .subscribe(
    //     (valor) => console.log('Subs:', valor),
    //     (err) => console.warn('Error:', err),
    //     () => console.info('Completado')
    //   );

    this.subs = this.retornaIntervalo()
    .subscribe(console.log);
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }



  private retornaIntervalo(): Observable<number> {
    return interval(500) // Emite el intervalo cada segundo
    .pipe(
      map(valor => valor += 1), // Modifica el valor
      filter(valor => (valor % 2 === 0 ? true : false)),
      // map(valor => 'Hola mundo ' + valor) // Modifica el tipo
      take(100), // Toma del intervalo los primeros 10 valores emitidos cada segundo
    );
  }

  private retornaObservable(): Observable<number> {
    let i = -1;

    return new Observable<number>((observer) => {
      const intervalo = setInterval(() => {
        i++;
        observer.next(i);

        if (i === 5) {
          clearInterval(intervalo);
          observer.complete();
        }

        if (i === 2) {
          console.log('i = 2 ... error');
          observer.error('i llegó al valor de 2');
        }
      }, 1000);
    });
  }
}
