import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form, Link, useActionData, useNavigation, useSubmit } from "@remix-run/react";
// import { authenticate } from "../shopify.server";
import {
  Card,
  EmptyState,
  Layout,
  Page,
  IndexTable,
  Thumbnail,
  Text,
  Icon,
  InlineStack,
} from "@shopify/polaris";
import { AlertDiamondIcon, ImageIcon } from "@shopify/polaris-icons";

import { getEmployees } from "../models/EmpUnique.server";

export async function loader({ request }) {
  // const { admin, session } = await authenticate.admin(request);
  const employees = await getEmployees();

  return json({
    employees,
  });
}

const EmptyEmployeeState = ({ onAction }) => (
  <EmptyState
    heading="Create a new Employee from here"
    action={{
      content: "Create Employee",
      onAction,
    }}
    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
  >
    <p>Lorem Ipsum text</p>
  </EmptyState>
);

function truncate(str, { length = 25 } = {}) {
  if (!str) return "";
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

const EmployeeTable = ({ employees }) => (
  <IndexTable
    resourceName={{
      singular: "Employee",
      plural: "Employees",
    }}
    itemCount={employees.length}
    headings={[
      { title: "Thumbnail", hidden: true },
      { title: "Name" },
      { title: "Age" },
      { title: "Designation" },
      { title: "Date created" },
    ]}
    selectable={false}
  >
    {employees.map((emp) => (
      <EmpTableRow key={emp.id} emp={emp} />
    ))}
  </IndexTable>
);

const EmpTableRow = ({ emp }) => (
  <IndexTable.Row id={emp.id} position={emp.id}>
    <IndexTable.Cell>
      {/* <Thumbnail
        source={emp.productImage || ImageIcon}
        alt={emp.productTitle}
        size="small"
      /> */}
    </IndexTable.Cell>
    <IndexTable.Cell>
      <Link to={`/emp_unique/${emp.id}`}>{truncate(emp.name)}</Link>
    </IndexTable.Cell>
    <IndexTable.Cell>{emp.age}</IndexTable.Cell>
    <IndexTable.Cell>{emp.designation}</IndexTable.Cell>
    <IndexTable.Cell>{new Date(emp.createdAt).toDateString()}</IndexTable.Cell>
  </IndexTable.Row>
);

export default function EmpUniquePage() {
  const { employees } = useLoaderData();
  const navigate = useNavigation();
  console.log('employees uniq', employees);    

  return (
    <Page>
      <ui-title-bar title="Employees">
        <button variant="primary" onClick={() => navigate("/app/emp_unique/new")}>
          Create a new Employee
        </button>
      </ui-title-bar>
      <Layout>
        <Layout.Section>
          <Card padding="0"> 
            {employees.length === 0 ? (
              <EmptyEmployeeState onAction={() => navigate("emp_unique/new")} />
            ) : (
              <EmployeeTable employees={employees} />
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
