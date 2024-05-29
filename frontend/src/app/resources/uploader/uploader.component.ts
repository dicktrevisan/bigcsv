import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FileSelectEvent,
  FileUploadModule,
  UploadEvent,
} from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { UploaderService } from './uploader.service';
import { Competencia } from './competencia.interface';

const primeModules = [FileUploadModule];
@Component({
  selector: 'app-uploader',
  standalone: true,
  providers:[],
  imports: [...primeModules, CommonModule],
    templateUrl: './uploader.component.html',
  styleUrl: './uploader.component.css'
})
export class UploaderComponent implements OnInit {
  competencia: string = '';
  mes: string = '';
  ano: string = '';
  formData: FormData = new FormData();
  constructor(private messageService: MessageService, private uploaderService:UploaderService
  ) {}
competencias: Competencia[]=[]
ngOnInit(): void {
  this.uploaderService.consultarCompetencias().subscribe(result=>{this.competencias=result

    console.log(this.competencias)
  })
}

  checkFile(event: FileSelectEvent) {
    const fileName = event.currentFiles[0].name;
    if (fileName.startsWith('DIMP_PORTAL_')) {
      this.mes = fileName.slice(-6, -4);
      this.ano = fileName.slice(-10, -6);
      this.formData.append('file', event.currentFiles[0], fileName);

    }
  }
  onUpload(event: UploadEvent|any) {
    console.log("chapolim", event)
    this.uploaderService.enviarDimp(this.formData, this.mes,this.ano).subscribe(result=>console.log(result))
    this.messageService.add({
      severity: 'info',
      summary: 'File Uploaded',
      detail: '',
    });
  }
}
