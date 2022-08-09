import { LightningElement, wire, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import EMPLOYEE__C_OBJECT from '@salesforce/schema/Employee__c';
import NAME_FIELD from '@salesforce/schema/Employee__c.Name';
import BIRTHDAY__c_FIELD from '@salesforce/schema/Employee__c.BirthDay__c';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';
import GENDER__c_FIELD from '@salesforce/schema/Employee__c.Gender__c';
import SALARY__c_FIELD from '@salesforce/schema/Employee__c.Salary__c';
import getEmployees from '@salesforce/apex/InsertEmployee.getEmployees';
import delEmployee from '@salesforce/apex/InsertEmployee.delEmployee';
const COLUMNS = [
  { label: 'Employee Name', fieldName: NAME_FIELD.fieldApiName, type: 'text',editable: true},
  { label: 'Gender', fieldName: GENDER__c_FIELD.fieldApiName, type: 'text',editable: true },
  { label: 'Salary', fieldName: SALARY__c_FIELD.fieldApiName, type: 'currency',editable: true },
  { label: 'BirthDay', fieldName: BIRTHDAY__c_FIELD.fieldApiName, type: 'date',editable: true },
  {
    type: "button",
    name: "Del1",
    typeAttributes: {
       
        label: "Delete",
        title: "Delete",
        name: "Delete",
        iconPosition: "center",
        variant: "brand"
      }
    },
    
];


export default class RegisterEmployeesAndList extends LightningElement {

  @track 
  list = []

  columns = COLUMNS;
  objectApiName = EMPLOYEE__C_OBJECT;
  fields = [NAME_FIELD, BIRTHDAY__c_FIELD, GENDER__c_FIELD, SALARY__c_FIELD];
  
  @api recordId;
  @api objectApiName;


 @api 
  loadData(){ 
    getEmployees().then(result => {
      this.list = result;
    })
  }

    connectedCallback(){
      this.loadData();
    }

    handleClick(event) {

      console.dir(event);
        const record = event.detail.row.Id;
        const idToButton = event.detail.action.name
        console.log(record);
        console.log(idToButton);
          if(idToButton === "Delete"){
            delEmployee({record:record}).then((result) => {
              this.list = result;
              console.log("Teste2")
            })
          }
        //   console.log(event.detail.row.Id);
          console.log("Teste3")
        }

    
    async handleSave(event) {
      // Convert datatable draft values into record objects
      const records = event.detail.draftValues.slice().map((draftValue) => {
          const fields = Object.assign({}, draftValue);
          return { fields };
      });

      // Clear all datatable draft values
      this.draftValues = [];

      try {
          // Update all records in parallel thanks to the UI API
          const recordUpdatePromises = records.map((record) =>
              updateRecord(record)
          );
          await Promise.all(recordUpdatePromises);

          // Report success with a toast
          this.dispatchEvent(
              new ShowToastEvent({
                  title: 'Success',
                  message: 'Contacts updated',
                  variant: 'success'
              })
          );

          // Display fresh data in the datatable
          await refreshApex(this.contacts);
      } catch (error) {
          this.dispatchEvent(
              new ShowToastEvent({
                  title: 'Error updating or reloading contacts',
                  message: error.body.message,
                  variant: 'error'
              })
          );
      }
  }

    handleSuccess(event) {
      const toastEvent = new ShowToastEvent({
          title: "Employee created",
          message: "Record ID: " + event.detail.id, 
          variant: "success"
      });

      refreshApex(this.list);
      this.loadData();
      this.dispatchEvent(toastEvent);
    }

    handleReset(event) {

      const inputFields = this.template.querySelectorAll("lightning-input-field");
      console.log(inputFields);
      inputFields.forEach(inputField => {
        console.log(inputField.name);
          inputField.reset();
      });     
    }
    handleSubmit(event){
      event.preventDefault();
      let field = event.detail.fields;
      field.Type = 'New Customer';
      field.StageName = 'Closed Won';
      const fields = this.template.querySelector('lightning-record-edit-form');
      fields.submit(); 
     this.handleReset(event);
      
    }

}