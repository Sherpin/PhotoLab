import { FileService } from './../../../services/file.service';
import { FileSelectDirective } from 'ng2-file-upload';
import { UserChangePassword } from './../../../models/user.change.password.interface';
import { User } from "./../../../models/user.interface";
import { UserService } from "./../../../services/user.service";
import { Component, OnInit } from "@angular/core";
import { UserEdit } from "../../../models/user.edit.interface";
import { ToastrService } from "ngx-toastr";
import { UserEditDelivery } from "../../../models/user.edit.delivery.interface";
import { UserEditInvoice } from "../../../models/user.edit.invoice.interface.ts";
import { Order } from '../../../models/order.class';
import { OrderState } from '../../../models/order-state.class';
@Component({
  selector: "app-user-panel",
  templateUrl: "./user-panel.component.html",
  styleUrls: ["./user-panel.component.scss"]
})
export class UserPanelComponent implements OnInit {
  userEdit: UserEdit;
  userEditDelivery: UserEditDelivery;
  userEditInvoice: UserEditInvoice;
  userChangePassword : UserChangePassword;
  orders : Array<Order>;
  errorMessage: any;
  orderState : OrderState = new OrderState();
  constructor(
    public userService: UserService,
    public toastrService: ToastrService,
    public fileService : FileService
  ) {}
  
  userEditTab() {
      (this.userEdit.firstName = this.userService.client.firstName),
      (this.userEdit.lastName = this.userService.client.lastName),
      (this.userEdit.email = this.userService.client.email),
      (this.userEdit.phoneNumber = this.userService.client.phoneNumber);
  }
  userEditDeliveryTab() {
    this.userService.getUserDelivery(this.userService.client.id).subscribe(data => {
      this.userEditDelivery = data
    }, error => (this.errorMessage = error));
  }
  userEditInvoiceTab() {
    this.userService.getUserInvoice(this.userService.client.id).subscribe(data => {
      this.userEditInvoice = data
    }, error => (this.errorMessage = error));
  }
  changePassword(userChangePassword : UserChangePassword, isValid: boolean) {
    userChangePassword.id = this.userService.client.id;
    this.userService.changePassword(userChangePassword).subscribe(data => {
      this.toastrService.success("Hasło został zmienione!");
    }, error => {this.errorMessage = error, 
      this.toastrService.error("Błąd: Hasło nie zostało zmienione!");      
    });
  }
  getUserOrders() {
    console.log(this.userService.client.id);
    this.fileService
    .getUserOrders(this.userService.client.id)
    .subscribe(
      data => { this.orders = data; },
      error => (this.errorMessage = error)
    );
  }
  getStatusName(status: number){
    return this.orderState.states.find(x => x.id == status).name;
  }
  ngOnInit() {
    this.userEdit = {
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: ""
    };
    this.userEditDelivery = {
      id: "",
      deliveryFirstName: "",
      deliveryLastName: "",
      deliveryAddress: "",
      deliveryCity: "",
      deliveryPostCode: ""
    };
    this.userEditInvoice = {
      id: "",
      invoiceFirstName: "",
      invoiceLastName: "",
      invoiceCompany: "",
      invoiceNip: "",
      invoiceAddress: "",
      invoicePostCode: "",
      invoiceType: true
    };
    this.userChangePassword = {
      id: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
    this.userService.getClient();
    this.userEditTab();
    this.getUserOrders();

  }

  logout() {
    this.userService.logout();
  }
  editProfile() {
    this.userEdit.id = this.userService.client.id;
    this.userService.editUser(this.userEdit).subscribe(data => {
      this.toastrService.success("Profil został zaktualizowany!");
    }, error => (this.errorMessage = error));
  }
  editDeliveryData() {
    this.userEditDelivery.id = this.userService.client.id;
    this.userService.editUserDelivery(this.userEditDelivery).subscribe(data => {
      this.toastrService.success("Dane do wysyłki zostały zaktualizowana!");
    }, error => (this.errorMessage = error));
  }
  editInvoiceData() {
    this.userEditInvoice.id = this.userService.client.id;
    this.userService.editUserInvoice(this.userEditInvoice).subscribe(data => {
      this.toastrService.success("Dane do faktury zostały zaktualizowane!");
    }, error => (this.errorMessage = error));
  }
}
