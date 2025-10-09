// imports
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// customer model
export interface Customer {
    id: number;
    name: string;
    email: string;
    password: string;
}

export class CustomerModel {
    private customers: Customer[] = [];
    private activeTokens: string[] = [];
    private SECRET = "supersecretkey";
    
    // U001 - SIGNUP
    signup(email: string, password: string, name = ""): string {
        if (this.customers.find(u => u.email === email)) {
        throw new Error("User already exists");
        }

        const hashed = bcrypt.hashSync(password, 10);
        const id = this.customers.length + 1;

        this.customers.push({ id, name, email, password: hashed });
        return "Signup successful";
    }

    // U004 - LOGIN
    login(email: string, password: string): string {
        const customer = this.customers.find(u => u.email === email);
        if (!customer || !bcrypt.compareSync(password, customer.password)) {
        throw new Error("Invalid credentials");
        }

        const token = jwt.sign({ id: customer.id, email: customer.email }, this.SECRET, { expiresIn: "1h" });
        this.activeTokens.push(token);
        return token;
    }
    

    // U005 - LOGOUT
    logout(token: string): string {
        const index = this.activeTokens.indexOf(token);
        if (index === -1) {
        throw new Error("Invalid token or already logged out");
        }

        this.activeTokens.splice(index, 1);
        return "Logout successful";
    }

    // U003 - DELETE ACCOUNT
    deleteAccount(token: string): string {
        try {
        const decoded = jwt.verify(token, this.SECRET) as { id: number; email: string };

        if (!this.activeTokens.includes(token)) {
            throw new Error("Token expired or logged out");
        }

        const index = this.customers.findIndex(c => c.id === decoded.id);
        if (index === -1) {
            throw new Error("User not found");
        }

        this.customers.splice(index, 1);
        this.activeTokens.splice(this.activeTokens.indexOf(token), 1);

        return "Account deleted successfully";
        } catch {
        throw new Error("Invalid token");
        }
    }
}