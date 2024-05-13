import { AsyncPipe, Location, NgStyle } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DividerModule } from 'primeng/divider';
import { ListboxModule } from 'primeng/listbox';
import {
  DialogService as PrimeDialogService,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { SharedService } from '../shared.service';
const primeModules = [
  MenubarModule,
  ButtonModule,
  InputTextareaModule,
  InputTextModule,
  AvatarModule,
  OverlayPanelModule,
  DividerModule,
  ListboxModule,
];

@Component({
  selector: 'app-header',
  standalone: true,
  providers: [PrimeDialogService],
  imports: [
    ...primeModules,
    AsyncPipe,
    RouterLink,
    RouterOutlet,
    FormsModule,
    NgStyle,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  sharedService= inject(SharedService)
  router = inject(Router);
  menubarItems: MenuItem[] | undefined;
  avatarItems: MenuItem[] | undefined;
  ref: DynamicDialogRef | undefined;
  primeDialogService = inject(PrimeDialogService);

  reclamacaoAberta = false;
  isLogged = false;
  styleLogin = { color: 'primary', name: 'Login' };
  ngOnInit() {
    localStorage.removeItem('token');
    localStorage.removeItem('documento');
    this.menubarItems = [
      {

          label: 'Prefeitura',
          target: 'https://www.toledo.pr.gov.br/',

      },
      {
        label: 'Sobre',

        routerLink: '/',
      },
      {
        label: 'Páginas',
        items: [
          {
            label: 'Prefeitura',
            target: 'https://www.toledo.pr.gov.br/',
          },
          {
            label: 'Protocolo',
            target: 'https://www.toledo.pr.gov.br/servicos/protocolo_online',
          },
        ],
      },
    ];
  }




  logout() {
    localStorage.clear();


    this.router.navigate(['/login'], {
      replaceUrl: true,
    });
  }






}
