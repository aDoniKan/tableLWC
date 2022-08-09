public without sharing class InsertEmployee {
    public String idToDel{get;set;}
   public String record{get;set;}

   @AuraEnabled
   public static List<Employee__c> getEmployees() {
       return [
           SELECT Name, BirthDay__c, Gender__c, Salary__c
           FROM Employee__c
           ORDER BY CreatedDate DESC
       ];
   }
  
   @AuraEnabled
   public static  List<Employee__c> delEmployee(String record) {
      System.debug('Record'+ record);
   
       Employee__c employee = [
           SELECT Name, BirthDay__c, Gender__c, Salary__c
           FROM Employee__c
           WHERE Id = :record
       ][0];
       delete employee;
       return getEmployees();
   }
}
