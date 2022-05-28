import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, map, take } from 'rxjs/operators';
import { FileUpload } from '../models/file-upload.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(
    private storage: AngularFireStorage,
    private db: AngularFireDatabase,
    private userService: UserService,
  ) { }

  pushFileToStorage(fileUpload: FileUpload, path: string, folder: UploadFolder, fileName: string) {
    const newFileName = fileName + this.getExtension(fileUpload.file.name);
    const filePath = `/${path}/${folder}/${newFileName}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          fileUpload.url = downloadURL;
          fileUpload.name = fileUpload.file.name;
          this.saveFileData(fileUpload, path);
          if(folder === 'profile_pic') this.saveProfilePicToProfile(path,downloadURL);
        });
      })
    ).subscribe();
    return uploadTask.percentageChanges();
  }

  async saveProfilePicToProfile(userId: string, downloadURL: string) {
    const userPublicData = await this.userService.getUserPublicData$(userId).pipe(take(1)).toPromise();
    if (!userPublicData) return Promise.reject('wrong user');
    userPublicData.userImage = downloadURL;
    await this.userService.setUserPublicData(userId, userPublicData);
    return Promise.resolve('success')
  }

  getExtension(fileName: string) {
    const re = /(?:\.([^.]+))?$/;
    const execArray = re.exec(fileName);
    if(execArray && execArray[0]) return execArray[0];
    return '';
  }

  private saveFileData(fileUpload: FileUpload, path: string): void {
    this.db.list(path).push(fileUpload);
  }

  getFiles(path: string, numberItems?: number): AngularFireList<FileUpload> {
    return this.db.list(path, ref => {
      if(numberItems) return ref.limitToLast(numberItems);
      return ref;
    });
  }

  async deleteFile(fileUpload: FileUpload, path: string) {
    return this.deleteFileDatabase(fileUpload.key, path)
      .then(() => {
        this.deleteFileStorage(fileUpload.name,path);
        return Promise.resolve('Success');
      })
      .catch(error => Promise.reject(error));
  }
  private deleteFileDatabase(key: string, path: string): Promise<void> {
    return this.db.list(path).remove(key);
  }
  private deleteFileStorage(name: string, path: string): void {
    const storageRef = this.storage.ref(path);
    storageRef.child(name).delete();
  }

}
export type UploadFolder = '' | 'profile_pic';
