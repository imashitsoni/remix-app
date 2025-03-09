import db from '../db.server'; 

// Get all Employees
export async function getEmployees(){
    return await db.employee.findMany({
        orderBy: { createdAt: "desc" },
    });
}

// Get a single Employee by ID
export async function getEmployeeByID(id){
    return await db.employee.findUnique({
        where: { id: Number(id) },
    });
}
 
// Create a New Employee
export async function createEmployee({ name, age, designation }){
    //check if an employee already exist
    const existingEmployee = await db.employee.findFirst({
        where: { name }
    });

    if(existingEmployee){
        return { error: "Employee already exists!" };
    }

    // Create a new employee if not found
    return await db.employee.create({
        data: {
            name,
            age: Number(age), // Ensure age is an integer
            designation
        }
    })
}

// Update and existing Employee
export async function updateEmployee(id, { name, age, designation }){
    return await db.employee.update({
        where: { id: Number(id) },
        data: {
            name,
            age: Number(age),
            designation
        },
    });
}

// Delete an Employee
export async function deleteEmployee(id){
    return await db.employee.delete({
        where: { id: Number(id) },
    });
}
