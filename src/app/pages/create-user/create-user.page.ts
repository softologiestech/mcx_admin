import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ActionSheetController, LoadingController } from '@ionic/angular';
import * as firebase from 'firebase';
import { UploadService } from 'src/app/services/upload.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.page.html',
  styleUrls: ['./create-user.page.scss'],
})
export class CreateUserPage implements OnInit {
  name: string = '';
  username: string = '';
  email: string = '';
  id: string = Math.random().toString(36).slice(-8);
  type: string = localStorage.getItem('type');
  password: string = '';
  address: string = '';
  phone: string = '';
  alt: string = '';
  aadhar: string = '';
  aadharUrl: string = '';
  pan: string = '';
  panUrl: string = '';
  aluminium: number;
  copper: number;
  crudeoil: number;
  gold: number;
  goldm: number;
  lead: number;
  nickel: number;
  nse: number;
  silver: number;
  silverm: number;
  zinc: number;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private uploadService: UploadService,
    private actionSheetController: ActionSheetController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {}

  create() {
    this.presentLoading();

    if (this.aadhar)
      this.uploadService.uploadAadhar(this.aadhar).then((data) => {
        // console.log(data)

        this.aadharUrl = data;
      });

    if (this.pan)
      this.uploadService.uploadPan(this.pan).then((data) => {
        // console.log(data)

        this.panUrl = data;
      });

    this.auth
      .createUserWithEmailAndPassword(this.email, this.password)
      .then((data) => {
        console.log(data);

        this.db
          .doc(`user/${this.id}`)
          .set({
            name: this.name,
            username: this.username,
            email: this.email,
            phone: this.phone,
            alt: this.alt,
            password: this.password,
            id: this.id,
            type: 'user',
            net_commission: 0,
            uid: data.user.uid,
            createdAt: Date.now(),
            createdBy: localStorage.getItem('uid'),
            creatorType: localStorage.getItem('type'),
          })
          .then(() => {
            if (this.type === 'admin')
              this.db
                .doc(`${this.type}/${localStorage.getItem('uid')}`)
                .collection('users')
                .doc(this.id)
                .set({
                  id: this.id,
                  name: this.name,
                  username: this.username,
                  password: this.password,
                  createdAt: Date.now(),
                });
            else
              this.db
                .doc(`${this.type}/${localStorage.getItem('id')}`)
                .collection('users')
                .doc(this.id)
                .set({
                  id: this.id,
                  name: this.name,
                  username: this.username,
                  password: this.password,
                  createdAt: Date.now(),
                });

            this.db
              .doc(`user/${this.id}`)
              .collection('margin')
              .doc(uuidv4())
              .set({
                ALUMINIUM: this.aluminium,
                COPPER: this.copper,
                CRUDEOIL: this.crudeoil,
                GOLD: this.gold,
                GOLDM: this.goldm,
                LEAD: this.lead,
                NICKEL: this.nickel,
                NSE: this.nse,
                SILVER: this.silver,
                SILVERM: this.silverm,
              });

            this.loadingController.dismiss();
            this.router.navigate(['/home']);
          })
          .catch((err) => {
            // console.log(err)
            this.loadingController.dismiss();
          });
      });
  }

  async presentAadharActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Aadhar Card Image Upload',
      buttons: [
        {
          text: 'Select from Gallery',
          icon: 'image-outline',
          handler: () => {
            this.uploadService.selectImagefromGallery().then((data) => {
              this.aadhar = data;

              console.log(data);
            });
          },
        },
        {
          text: 'Use Camera',
          icon: 'camera-outline',
          handler: () => {
            this.uploadService.selectImagefromCamera().then((data) => {
              this.aadhar = data;

              // console.log(data);
            });
          },
        },
      ],
    });

    await actionSheet.present();
  }

  async presentPanActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Aadhar Card Image Upload',
      buttons: [
        {
          text: 'Select from Gallery',
          icon: 'image-outline',
          handler: () => {
            this.uploadService.selectImagefromGallery().then((data) => {
              this.pan = data;

              console.log(data);
            });
          },
        },
        {
          text: 'Use Camera',
          icon: 'camera-outline',
          handler: () => {
            this.uploadService.selectImagefromCamera().then((data) => {
              this.pan = data;

              // console.log(data);
            });
          },
        },
      ],
    });

    await actionSheet.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Creating User ...',
      spinner: 'crescent',
    });
    await loading.present();
  }
}
