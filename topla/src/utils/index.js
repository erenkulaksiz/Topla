import _ from "lodash";
import { Parser } from 'expr-eval';

const map = (value, x1, y1, x2, y2) => ((value - x1) * (y2 - x2) / (y1 - x1) + x2);

const question = {
    operations: ["addition", "subtraction", "multiplication", "division"],
    operation({ val, humanized = true }) {
        switch (val) {
            case this.operations[0]: {
                return "+"
            }
            case this.operations[1]: {
                return "-"
            }
            case this.operations[2]: {
                if (humanized) {
                    return "x"
                } else {
                    return "*"
                }
            }
            case this.operations[3]: {
                return "/"
            }
        }
    },
    generateRandomInt({ min, max }) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    isInt(value) {
        return (parseFloat(value) == parseInt(value)) && !isNaN(value);
    },
    isPrime(value) {
        let result = 0;
        for (let i = 1; i < value; i++) { if (value % i == 0) result++; }
        if (result > 1) return false
        return true
    },
    generate({
        questionCount,
        allowedOperations,
        minRange,
        maxRange,
        optionCount,
        digitLength = 2, // x+y => length of 2
        allowNegative = false,
        allowFloat = false,
    }) {
        return new Promise((resolve, reject) => {
            const questions = [];
            for (let i = 0; i <= questionCount; i++) {
                const _allowedOperations = Object.keys(allowedOperations).filter(k => allowedOperations[k] === true);
                let _expBuilder = [];
                let _pickedNumbers = [];
                let _pickedOperations = [];
                let _answer = 0;
                const _gen = () => {
                    _expBuilder = [];
                    _pickedNumbers = [];
                    _pickedOperations = [];

                    for (let a = 1; a <= digitLength; a++) {
                        const _operation = _allowedOperations[_.sample(Object.keys(_allowedOperations))];
                        const _pickedNumber = this.generateRandomInt({ min: minRange, max: maxRange });
                        _expBuilder.push(_pickedNumber);
                        _pickedNumbers.push(_pickedNumber);
                        _pickedOperations.push(_operation);
                        if (a != digitLength) {
                            _expBuilder.push(this.operation({ val: _operation, humanized: false }));
                        }
                    }

                    let _divideCountResult = _expBuilder.filter(exp => exp == "/");
                    _expBuilder[0] = this.generateRandomInt({ min: minRange, max: maxRange });
                    while (this.isPrime(_expBuilder[0])) {
                        _expBuilder[0] = this.generateRandomInt({ min: minRange, max: maxRange });
                    }
                    let _dividerFind = [];
                    for (let i = 1; i < _expBuilder[0]; i++) {
                        const result = _expBuilder[0] / i;
                        if (this.isInt(result)) {
                            _dividerFind.push(result);
                        }
                    }
                    _dividerFind.shift();
                    _expBuilder[2] = _dividerFind[Math.floor(Math.random() * _dividerFind.length)];
                    console.log("Divider found: ", _dividerFind);

                    _answer = Parser.evaluate(_expBuilder.join(" "));
                    while ((_answer < 0) && !allowNegative) {
                        _expBuilder = [];
                        _pickedNumbers = [];
                        _pickedOperations = [];
                        console.log("Negative answer!", _answer);
                        _gen();
                    }
                    if (!this.isInt(_answer) && !allowFloat) {
                        while (this.isPrime(_expBuilder[4])) {
                            _expBuilder[4] = this.generateRandomInt({ min: minRange, max: maxRange });
                        }
                    }
                    //////////////////////////////////////////////////////////
                    /*
                    let _divider = false;
                    _expBuilder.map(exp => {
                        if (exp == "/") _divider = true;
                    })
                    if (!allowFloat && _divider) {
                        while (!this.isInt(_answer)) {
                            _expBuilder.map((exp, index) => {
                                console.log("exp: ", exp);

                                if (exp != "+" && exp != "-" && exp != "*" && exp != "/") {
                                    if (index != 0) {
                                        _expBuilder[index] = this.generateRandomInt({ min: minRange, max: maxRange });
                                        _answer = Parser.evaluate(_expBuilder.join(" "));
                                        console.log("aaanswer: ", _answer);
                                    }
                                }

                            })
                            //_expBuilder = [];
                            //_pickedNumbers = [];
                            //_pickedOperations = [];
                            console.log("floatpoint!", _answer, " allowFloat: ", allowFloat);

                            //_gen();
                        }
                    }
                    if (_divider) {
                        while (_answer == 1) {
                            console.log("Answer is 1 on divider, rebuilding");
                            _expBuilder = [];
                            _pickedNumbers = [];
                            _pickedOperations = [];
                            _gen();
                        }
                        while (_answer == _expBuilder[0]) {
                            console.log("Found _answer == expBuilder[0] rebuilding");
                            _expBuilder = [];
                            _pickedNumbers = [];
                            _pickedOperations = [];
                            _gen();
                        }
                    }
                    */
                }
                _gen();

                console.log("Answer is int: ", this.isInt(_answer), " answer: ", _answer, " expbuilder: ", _expBuilder);

                /*
                let _divider = false;
                _expBuilder.map(exp => {
                    if (exp == "/") _divider = true;
                })
                if (_divider) {
                    while (_answer == 1) {
                        console.log("Answer is 1 on divider, rebuilding");
                        _expBuilder = [];
                        _pickedNumbers = [];
                        _pickedOperations = [];
                        _gen()
                    }
                }
                */


                console.log("Expbuilder of QuestionGenerate", _expBuilder.join(" "), " = ", _answer);

                questions.push({
                    question: _expBuilder.join(" "),
                    questionArguments: [..._pickedNumbers],
                    questionAnswer: _answer,
                    questionOptions: [],
                    questionOperation: [..._pickedOperations],
                });


                /*
                if (_questionOperation == this.operations[0]) {
                    _pickedNumbers.tmp = _pickedNumbers.a + _pickedNumbers.b;
                } else if (_questionOperation == this.operations[1]) {
                    if (allowNegative) {
                        _pickedNumbers.tmp = _pickedNumbers.a - _pickedNumbers.b;
                    } else {
                        _pickedNumbers.tmp = _pickedNumbers.a - _pickedNumbers.b;
                        if (_pickedNumbers.tmp < 0) {
                            _pickedNumbers.a = _pickedNumbers.a ^ _pickedNumbers.b;
                            _pickedNumbers.b = _pickedNumbers.a ^ _pickedNumbers.b;
                            _pickedNumbers.a = _pickedNumbers.a ^ _pickedNumbers.b;
                            _pickedNumbers.tmp = _pickedNumbers.a - _pickedNumbers.b;
                        }
                    }
                } else if (_questionOperation == this.operations[2]) {
                    _pickedNumbers.tmp = _pickedNumbers.a * _pickedNumbers.b;
                } else if (_questionOperation == this.operations[3]) {
                    if (allowFloatOnDivision) {
                        _pickedNumbers.tmp = _pickedNumbers.a / _pickedNumbers.b;
                    } else {
                        _pickedNumbers.a = this.generateRandomInt({ min: minRange, max: maxRange });
                        const _dividers = [];
                        while (isPrime(_pickedNumbers.a)) {
                            _pickedNumbers.a = this.generateRandomInt({ min: minRange, max: maxRange });
                        }
                        while (!isInt(_pickedNumbers.a / _pickedNumbers.b)) {
                            _pickedNumbers.b = this.generateRandomInt({ min: minRange, max: maxRange });
                        }
                        for (let a = 1; a < _pickedNumbers.a; a++) {
                            const _result = _pickedNumbers.a / a;
                            if (isInt(_result)) {
                                _dividers.push(_result);
                            }
                        }
                        _randomDivider = _.sample(_dividers);
                        while (_randomDivider == _pickedNumbers.a) {
                            _randomDivider = _.sample(_dividers);
                        }
                        _pickedNumbers.b = _randomDivider;
                        _pickedNumbers.tmp = _pickedNumbers.a / _pickedNumbers.b;
                    }
                }
                */
                /*
                questions.push({
                    question: `${_pickedNumbers.a} ${this.operation({ val: _questionOperation })} ${_pickedNumbers.b}`,
                    questionArguments: [_pickedNumbers.a, _pickedNumbers.b],
                    questionAnswer: _pickedNumbers.tmp,
                    questionOptions: [],
                    questionOperation: _questionOperation,
                });
                */
            }

            questions.map(question => {
                for (let a = 1; a <= optionCount; a++) {
                    if (a == 1) {
                        question.questionOptions.push(this.isInt(question.questionAnswer) ? question.questionAnswer : question.questionAnswer.toFixed(3));
                    } else {
                        const digits = Math.max(Math.floor(Math.log10(Math.abs(question.questionAnswer))), 1);
                        const range = Math.pow(10, digits);

                        const randomNumber = Math.abs(this.generateRandomInt({ min: question.questionAnswer - range, max: question.questionAnswer + range }));
                        if (question.questionOptions.indexOf(randomNumber) < 0) {
                            if (question.questionAnswer < 0) {
                                question.questionOptions.push(randomNumber * -1);
                            } else {
                                question.questionOptions.push(this.isInt(question.questionAnswer) ? randomNumber : randomNumber.toFixed(3));
                            }
                        } else {
                            a--;
                        }
                    }
                }
            });

            questions.map(question => question.questionOptions.sort(() => Math.random() - 0.5));
            resolve(questions);
        });
    }
};

export { map, question }