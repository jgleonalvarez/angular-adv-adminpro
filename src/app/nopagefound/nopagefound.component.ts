import { Component } from '@angular/core';

@Component({
  selector: 'app-nopagefound',
  templateUrl: './nopagefound.component.html',
  styleUrls: ['./nopagedfoud.component.css'
  ]
})
export class NopagefoundComponent {
  year = new Date().getFullYear();

}