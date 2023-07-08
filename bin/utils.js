"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ageToAgeClass = void 0;
function ageToAgeClass(age) {
    if (age < 4)
        return "Toddler";
    else if (age >= 4 && age < 12)
        return "Child";
    else if (age >= 12 && age < 20)
        return "Teenager";
    else if (age >= 20 && age < 30)
        return "Young Adult";
    else if (age >= 30 && age < 40)
        return "Early Adult";
    else if (age >= 40 && age < 50)
        return "Middle Adult";
    else if (age >= 50 && age < 70)
        return "Late Adult";
    else
        return "Senior";
}
exports.ageToAgeClass = ageToAgeClass;
//# sourceMappingURL=utils.js.map