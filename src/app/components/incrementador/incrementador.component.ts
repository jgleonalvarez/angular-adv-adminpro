import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styleUrls: ['./incrementador.component.css']
})
export class IncrementadorComponent implements OnInit {

  @Input('valor') progreso: number = 50;
  @Input() btnClass: string = 'btn-primary';

  @Output('valor') valorSalida: EventEmitter<number> = new EventEmitter();

  ngOnInit(): void {
    this.btnClass = `btn ${this.btnClass}`;
  }

  cambiarValor(valor: number) {
    if (this.progreso >= 100 && valor >= 0) {
      this.progreso = 100;
      this.valorSalida.emit(this.progreso);
      return;
    }

    if (this.progreso <= 0 && valor < 0) {
      this.progreso = 0;
      this.valorSalida.emit(this.progreso);
      return;
    }

    this.progreso = this.progreso + valor;
    this.valorSalida.emit(this.progreso);
  }

  onChange(valor: number) {

    if (valor >= 100) {
      this.progreso = 100;
    } else if (valor <= 0) {
      this.progreso = 0;
    } else {
      this.progreso = valor;
    }
    this.valorSalida.emit(this.progreso);
  }
}
