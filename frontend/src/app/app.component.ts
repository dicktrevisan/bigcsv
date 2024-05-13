import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {
  FileSelectEvent,
  FileUploadModule,
  UploadEvent,
} from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule, } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';
import { HeaderComponent } from './shared/header/header.component';
import { LoginService } from './pages/login/login.service';

const primeModules = [FileUploadModule];
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [...primeModules, CommonModule, RouterOutlet, HeaderComponent],
  providers: [MessageService, LoginService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {

}
