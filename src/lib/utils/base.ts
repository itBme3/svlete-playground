export default abstract class Base {
    
    protected validators: Record<
      string,
      (item: any, value: any, current: any, updating: boolean) => undefined | string
    > = {};
    
    validate(
      item: any,
      key: string | Array<string> = [],
      value?: any
    ): Array<string> {
      const errors: Array<string> = [];
      let checks: Array<string> = [];
      if (Array.isArray(key) && key.length > 0) {
        checks = key;
      } else if (!Array.isArray(key)) {
        checks = [key];
      } else {
        checks = Object.keys(this.validators);
      }
  
      if (checks.length > 0) {
        checks.forEach((validatorKey) => {
          const currentValue = item[validatorKey];
          let validation;
          if (value) {
            validation =
              this.validators[validatorKey] &&
              this.validators[validatorKey](item, value, currentValue, true);
          } else {
            validation =
              this.validators[validatorKey] &&
              this.validators[validatorKey](item, currentValue, currentValue, false);
          }
  
          if (validation) {
            errors.push(validation);
          }
        });
      }
  
      return errors;
    }
  }