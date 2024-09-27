class AuthUserEntity {

    private id: string;
    private email: string;
    private name: string;

    constructor(id: string,email: string, name: string) {
        this.id = id;
        this.email = email;
        this.name = name;
    }

    getName() : string  {
        return this.name;
    }

    getEmail() : string {
        return this.email;
    }

    getId(): string {
        return this.id;
    }
    
}

export default AuthUserEntity;