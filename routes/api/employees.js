const express = require('express');
const router = express.Router();

const controller=require('../../controller/employeeController')

router.route('/')
    .get(controller.getAllEmployee)
    .post(controller.createEmployee)
    .put(controller.updateEmployee)
    .delete(controller.deleteEmployee);

router.route('/:id')
    .get(controller.getEmployee);

module.exports = router;
