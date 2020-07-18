function Person(_name = 'Person') {
    this.name = _name;
    this.setName = function (_name) {
        this.name = _name;
    }
}

Person.prototype.getName = function () {
    return this.name;
}

function Employee() {

}

Employee.prototype = new Person;

var employee = new Employee();
employee.setName('Bau Huynh');
console.log(employee.getName());
