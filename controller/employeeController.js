const data = {
  employees: require("../model/employees.json"),
  setEmployees: function (data) {
    this.employees = data;
  },
};

const getAllEmployee = (req, res) => {
  res.json(data.employees);
};

const createEmployee = (req, res) => {
  const { id, firstname, lastname } = req.body;
  const newEmployee = {
    id: id,
    firstname: firstname,
    lastname: lastname,
  };
  if (!newEmployee.firstname || !newEmployee.lastname) {
    return res.status(400).json({
      success: "false",
      message: "first and last name are neccessary",
    });
  }
  data.setEmployees([...data.employees, newEmployee]);
  res.json(data.employees);
};

const updateEmployee = (req, res) => {
  const { id, firstname, lastname } = req.body;
  const Oemp = data.employees.find((emp) => emp.id === Number(id));
  if (!Oemp) {
    return res.status(400).json({
      success: "false",
      message: `no employee with id ${id} found`,
    });
  }
  if (firstname) Oemp.firstname = firstname;
  if (lastname) Oemp.lastname = lastname;
  const newEmployees = data.employees.filter((emp) => emp !== Number(id));
  data.setEmployees([...newEmployees]);
  res.json(data.employees);
};

const deleteEmployee = (req, res) => {
  const { id } = req.body;
  const employee = data.employees.find((emp) => emp.id === Number(id));
  if (!employee) {
    return res.status(400).json({
      success: "false",
      message: `unable to find the employee with id ${req.params.id}`,
    });
  }
  const newEmployee = data.employees.filter((emp) => emp.id !== Number(id));
  data.setEmployees([...newEmployee]);
  res.json(data.employees);
};

const getEmployee = (req, res) => {
  const employee = data.employees.find(
    (emp) => emp.id === Number(req.params.id)
  );
  if (!employee) {
    return res.status(400).json({
      success: "false",
      message: `unable to find the employee with id ${req.params.id}`,
    });
  }
  res.json(employee);
};

module.exports = {
  getAllEmployee,
  getEmployee,
  updateEmployee,
  createEmployee,
  deleteEmployee,
};
