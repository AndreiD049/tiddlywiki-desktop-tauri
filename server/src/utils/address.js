const START_ADDRESS = [127, 1, 1, 1];
const PORT = 8000;

export class Address {
    constructor(host, port) {
        this.host = host;
        this.port = port;
    }
}

class AddressFactory {
    currentAddress = START_ADDRESS;

    getNextAddress() {
        for (let i = 3; i > 0; i--) {
            if (this.currentAddress[i] < 254) {
                this.currentAddress[i] += 1;
                break;
            } else {
                this.currentAddress[i] = 1;
            }
        }
        return new Address(this.currentAddress.join('.'), PORT);
    }
}

const AddressSingleton = new AddressFactory();

export default AddressSingleton;
