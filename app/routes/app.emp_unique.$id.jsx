import { useLoaderData, useActionData, useNavigation, useSubmit, Form } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from "../models/Emp.server";
import { useState } from "react";
import { Page, Layout, Card, TextField, Button, InlineError, BlockStack, PageActions, Text } from "@shopify/polaris";

export async function loader() {
  const employees = await getEmployees();
  return json({ employees });
}

export async function action({ request }) {
  const formData = await request.formData();
  const id = formData.get("id");
  const name = formData.get("name");
  const age = formData.get("age");
  const designation = formData.get("designation");
  const actionType = formData.get("actionType");

  if (actionType === "create") {
    const result = await createEmployee({ name, age, designation });
    if (result.error) {
      return json({ error: result.error }, { status: 400 });
    }
    return json({ success: "Employee added successfully!" });
  } else if (actionType === "update") {
    await updateEmployee(id, { name, age, designation });
    return json({ success: "Employee updated successfully!" });
  } else if (actionType === "delete") {
    await deleteEmployee(id);
    return json({ success: "Employee deleted successfully!" });
  }
}

export default function EmpUniqueForm() {
  const { employees } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const submit = useSubmit();
  const [editingEmployee, setEditingEmployee] = useState(null);

  function handleEditClick(employee) {
    setEditingEmployee(employee);
  }

  function handleSave(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    submit(formData, { method: "post", encType: "application/x-www-form-urlencoded" });
    setEditingEmployee(null);
  }

  return (
    <Page title="Manage Employees">
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            {actionData?.error && <InlineError message={actionData.error} fieldID="error-field" />}
            {actionData?.success && <Text variant="bodyMd" color="success">{actionData.success}</Text>}
            <Card title="Add Employee" sectioned>
              <Form method="post">
                <input type="hidden" name="actionType" value="create" />
                <TextField label="Name" name="name" autoComplete="off" required />
                <TextField label="Age" name="age" type="number" required />
                <TextField label="Designation" name="designation" autoComplete="off" required />
                <Button submit primary disabled={isSubmitting}>Add Employee</Button>
              </Form>
            </Card>

            {employees.map((employee) => (
              <Card key={employee.id} title={employee.name} sectioned>
                {editingEmployee?.id === employee.id ? (
                  <Form method="post" onSubmit={handleSave}>
                    <input type="hidden" name="id" value={employee.id} />
                    <input type="hidden" name="actionType" value="update" />
                    <TextField label="Name" name="name" defaultValue={employee.name} required />
                    <TextField label="Age" name="age" type="number" defaultValue={employee.age} required />
                    <TextField label="Designation" name="designation" defaultValue={employee.designation} required />
                    <Button submit primary>Save</Button>
                    <Button onClick={() => setEditingEmployee(null)}>Cancel</Button>
                  </Form>
                ) : (
                  <>
                    <Text variant="bodyMd">Age: {employee.age}</Text>
                    <Text variant="bodyMd">Designation: {employee.designation}</Text>
                    <Button onClick={() => handleEditClick(employee)}>Edit</Button>
                    <Form method="post">
                      <input type="hidden" name="id" value={employee.id} />
                      <input type="hidden" name="actionType" value="delete" />
                      <Button submit destructive>Delete</Button>
                    </Form>
                  </>
                )}
              </Card>
            ))}
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
