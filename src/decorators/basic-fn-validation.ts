const userEmails = [
    "p.shaddel@gmail.com",
    "test@gmail.com"
];

function CheckDuplicateUser(): Function {
    function validate(target: Object, key: string | symbol, descriptor: PropertyDescriptor) {
        const childFunction = descriptor.value;

        descriptor.value = (...args: any[]) => {
            const emails = userEmails;

            const email = args[0].email;
            if (emails.indexOf(email) !== -1) {
                console.warn(`===== Email already exists! [${email}] =====\n`)
                return null;
            }

            return childFunction.apply(this, args);
        };

        return descriptor;
    }

    return validate;
}

class UserService {

    @CheckDuplicateUser()
    createUser(user: any): void {
        userEmails.push(user.email);
        console.log(`===== User saved in database! [${user}] =====\n`);
    }

}

function main() {
    const userService: UserService = new UserService();

    userService.createUser({ name: "Poorshad", email: "p.shaddel@gmail.com" });
    userService.createUser({ name: "John", email: "John.smith@gmail.com" });
    userService.createUser({ name: "Jack", email: "John.smith@gmail.com" });
}

(() => {
    main();
})();

// https://levelup.gitconnected.com/start-writing-your-own-typescript-method-decorators-c921cdc3d1c1
// https://levelup.gitconnected.com/elegant-typescript-data-validation-with-decorators-68ec7506fd87
