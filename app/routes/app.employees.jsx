import { useLoaderData, Form, useActionData, useNavigation, useSubmit } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from "../models/Emp.server";
import { useState } from 'react';

export async function loader(){
  const employees = await getEmployees();
  return json({ employees });
}

export async function action({ request }){
  const formData = await request.formData();
  const id = formData.get('id');
  const name = formData.get('name');
  const age = formData.get('age');
  const designation = formData.get('designation');
  const actionType = formData.get('actionType');

  if(actionType === 'create'){
    
    const result = await createEmployee({ name, age, designation });
    if (result.error) {
      return json({ error: result.error }, { status: 400 });
    }
    return json({ success: "Employee added successfully!" });

  }else if(actionType === 'update'){
    
    await updateEmployee(id, { name, age, designation });
    return json({ success: "Employee updated successfully!" });
  
  }else if(actionType === 'delete'){
    
    await deleteEmployee(id);
    return json({ success: "Employee deleted successfully!" });
  
  }

  return redirect('/app/employees');
}


export default function EmployeesPage(){
  const { employees } = useLoaderData();
  console.log('Employees: ', employees);
  
  const actionData = useActionData();

  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  
  const [editingEmployee, setEditingEmployee] = useState(null);
  const submit = useSubmit();

  function handleEditClick(employee){
    setEditingEmployee(employee);
  }

  function handleSave(e){
    e.preventDefault();
    const formData = new FormData(e.target);
    submit(formData, { method: 'post', encType: "application/x-www-form-urlencoded" });
    setEditingEmployee(null);
  }


  return (
    <div>
      <h1>Employees</h1>
      
      {/* Erro msg */}
      {actionData?.error && <p className="error-msg">{actionData.error}</p>} 
      {/* Success msg */}
      {actionData?.success && <p className="success">{actionData.success}</p>}
      
      <Form method="post" className="AddEmployee">
        <input type="hidden" name="actionType" value="create"/>
        <input type="text" name="name" placeholder="Name" required/>
        <input type="number" name="age" placeholder="Age" required/>
        <input type="text" name="designation" placeholder="Designation" required/>
        <button type="submit" disabled={isSubmitting}>Add Employee</button>
      </Form>

    <div>
      {employees.map((employee) => (
        <div key={employee.id} className="employee-item">
          {editingEmployee?.id === employee.id ? (
            <Form method="post" onSubmit={handleSave}>
              <input type="hidden" name="id" value={employee.id} />
              <input type="hidden" name="actionType" value="update" />
              <input type="text" name="name" defaultValue={employee.name} />
              <input type="number" name="age" defaultValue={employee.age} />
              <input type="text" name="designation" defaultValue={employee.designation} />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditingEmployee(null)}>Cancel</button>
            </Form>
          ) : (
            <>
              <span>{employee.name}</span>
              <span>{employee.age}</span>
              <span>{employee.designation}</span>
              <button onClick={() => handleEditClick(employee)}>Edit</button>
              <Form method="post">
                <input type="hidden" name="id" value={employee.id} />
                <input type="hidden" name="actionType" value="delete" />
                <button type="submit">Delete</button>
              </Form>
            </>
          )}
        </div>
      ))}
    </div>

    </div>
  )

}

