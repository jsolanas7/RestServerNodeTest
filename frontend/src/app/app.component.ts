import { Component, OnInit } from '@angular/core';
import { UserService } from './components/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'list-app';
  usersList;
  constructor(private _userService: UserService){

  }
  ngOnInit(){
    this._userService.getAll()
    .subscribe((res: any) => {
      this.usersList = res.usuarios;
    })
  }
}
