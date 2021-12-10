import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.getPersonas().then(users => {
      console.log(users);
    });

    // const promesa = new Promise((resolve, reject) => {
    //   if (true) {
    //     resolve('Hola mundo!');
    //   } else {
    //     reject('Algo salio mal');
    //   }
    // });

    // promesa.then((mensaje) => {
    //   console.log(mensaje);
    // }).catch(error => console.log(error));
  }

  getPersonas() {
    return new Promise((resolve) => {
      fetch('https://reqres.in/api/users')
      .then(result => result.json())
      .then(body => resolve(body.data))
    });
  }

}
