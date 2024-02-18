const { createApp } = Vue;

createApp({
 data() {
  return {
   output: '',
   input: '',
   num: '',
   dot: false,
   temp_output: '',
   bracketStack: [],
   history: [],
   show_history: false,
  }
 },
 watch: {
  output() {
    output_container = this.$refs.output_container;
    
    if(output_container.clientHeight > 96) {
      output_container.parentNode.scrollTo(0, output_container.clientHeight);
    }
  }
 },
 methods: {
  temp_output_toggle() {
   last = this.input.charAt(this.input.length-1);

   if(!!this.input.match("[+-/*]") && !"*/+-".includes(last) && this.bracketStack.length === 0) {
    this.temp_output = eval(this.input);
   }
   else {
    this.temp_output = '';
   }
  },
  clear() {
   this.output = '';
   this.input = '';
   this.temp_output = '';
   this.num = '';
   this.bracketStack = [];
  },
  type(e) {
   val = e.target.dataset.val;

  //  If you have only 0 as an argument, delete it:
   if(this.num === "0") { this.backspace() }

   if(!this.num.includes('.')) {
     if(this.num.length < 15) {
     this.num += val;
     this.output += val;
     this.input += val;
    }
   } else {
    dotIndex = this.num.indexOf('.');

    if(this.num.length < 16 && this.num.length - dotIndex < 11) {
     this.num += val;
     this.output += val;
     this.input += val;
    }
   }
   

   this.temp_output_toggle();
  },
  typeOperator(val) {
   last = this.input.charAt(this.input.length-1);
   this.output += this.num.length === 15 ? ' ' : '';

   if(val === '*') {
    this.output += `<span class="special">×</span>`;
   }
   else if(val === '/') {
    this.output += `<span class="special">÷</span>`;
   }
   else if(last === "(") {
    this.output += val;
   }
   else {
    this.output += `<span class="special">${val}</span>`;
   }
   
   this.num = '';

   this.input += val;
  },
  typeOperation(e) {
   last = this.input.charAt(this.input.length-1);
   val = e.target.dataset.val;

   if(!this.input) { return }
   else if(last === "(" && "*/".includes(val)) { return }

   if("*/+-".includes(last)) {
    if(this.input.charAt(this.input.length-2) === "(" && "*/".includes(val)) { return }

    if("+-".includes(this.output.charAt(this.output.length-1))) {
      this.input = this.input.slice(0, -1) + val;
      this.output = this.output.slice(0, -1) + val;
      return;
    }
    this.input = this.input.slice(0, -1);
    this.output = this.output.slice(0, -30);
   }

   this.typeOperator(val);

   this.temp_output_toggle();
  },
  redefineNum() {
   reverse_input=this.input.split("").reverse().join("");
   beginning = reverse_input.match("[+-/*]").index;
   this.num = this.input.slice(-beginning);
  },
  backspace() {
   last = this.input.charAt(this.input.length-1);

   if(!"*/+-".includes(last)) {
    this.input = this.input.slice(0, -1);
    this.output = this.output.slice(0, -1);
    this.num = this.num.slice(0, -1);

   }
   else if((last === "-" && this.input.charAt(this.input.length-2) === "(") || ("*/+-".includes(this.output.charAt(this.output.length - 1)))) {
    this.input = this.input.slice(0, -1);
    this.output = this.output.slice(0, -1);
   }
   else {
    this.input = this.input.slice(0, -1);
    this.output = this.input.charAt(this.input.length-31) === ' ' ? this.output.slice(0, -31) : this.output.slice(0, -30);

    if(!!this.input.match("[+-/*]")) {
     this.redefineNum();
    }
    else {
     this.num = this.input;
    }
   }

   if(this.input.match(/\(/g) || this.input.match(/\)/g)) {
      let begins = this.input.match(/\(/g);
      let ends = this.input.match(/\)/g) || [];

      this.bracketStack = Array(begins.length - ends.length).fill("(");
   }

   this.temp_output_toggle();
  },
  typeDot(){
   last = this.input.charAt(this.input.length - 1);
   if(last === ')') {
    this.typeOperator("*");
    this.input += '0.';
    this.num += '0.';
    this.output += '0.';
   }
   else if(this.input === '' || last === '(' || this.num === '') {
    this.input += '0.';
    this.num += '0.';
    this.output += '0.';
   }
   else if(this.num.length < 15 && !this.num.includes('.') && !"*/+-".includes(this.num.charAt(this.num.length - 1))) {
    this.input += '.';
    this.num += '.';
    this.output += '.';
   }
  },
  equal() {
   if(this.temp_output !== 0 && !this.temp_output) { return }

   temp = this.temp_output + '';

   history_item = { input : this.output, input_in: this.input, output : temp };
   this.history.push(history_item);

   this.output = temp;
   this.input = temp;
   this.num = temp;
   this.temp_output = '';
   this.show_history = false;
   this.$refs.history_box.scrollTo(0, this.$refs.history_box.clientHeight);
  },
  typeBrackets() {
   last = this.input.charAt(this.input.length - 1);
   if("+-/*".includes(last) || last === '(') {
    this.bracketStack.push("(");
    this.input += "(";
    this.output += "(";
    // this.num += "(";
   }
   else {
    if(this.bracketStack.length > 0) {
     this.bracketStack.pop();
     this.input += ")";
     this.output += ")";
    }else {
     this.typeOperator("*");
     this.bracketStack.push("(");
     this.input += "(";
     this.output += "(";
    }
   }
   this.temp_output_toggle();
   return;
  },
  plusMinus() {
    last = this.input.charAt(this.input.length - 1);
    if(")" === last) {
      this.typeOperator("*");
      last = this.input.charAt(this.input.length - 1);
    }
    // if last element is operator and element before is not (
    // or last element is plus and before element is (
    if(("+-/*".includes(last) && this.input.charAt(this.input.length - 2) !== "(") || (last === '+' && this.input.charAt(this.input.length - 2) === "(")) {
      this.bracketStack.push("(");
      this.input += "(-";
      this.output += "(-";
    }
    else {
      if(!this.input.match("[+-/*]")) {
        this.bracketStack.push("(");
        this.input = "(-" + this.input;
        this.output = "(-" + this.output;
      } 
      else if(this.num !== '') {
        if(this.input.slice(-this.num.length-2, -this.num.length) === '(-') {
          this.input = this.input.slice(0, -this.num.length-2) + this.input.slice(-this.num.length);
          this.output = this.output.slice(0, -this.num.length-2) + this.output.slice(-this.num.length);
          this.bracketStack.pop();
        }
        else {
          temp_input = this.input;
          this.input = temp_input.slice(0, -this.num.length) + "(-" + temp_input.slice(-this.num.length);
          this.output = this.output.slice(0, -this.num.length) + "(-" + this.output.slice(-this.num.length);
          this.bracketStack.push("(");
        }
      }
      else {
        this.input = this.input.slice(0, -2);
        this.output = this.output.slice(0, -2);
        this.bracketStack.pop();
      }
    }
    this.temp_output_toggle();
    return;
  },
  clear_history() {
    this.history = [];
    setTimeout(this.show_history = false, 1000);
  },
  display_history(e) {
    
    if(!e.target.className.includes("active")) { return }
    
    this.show_history = !this.show_history;

    return;
  },
  useHistory(inp, out) {
    if(this.input !== '' && this.input.charAt(this.input.length -1) === ")") {
      this.typeOperator('*');
    }
    this.input += inp;
    this.output += out;

    this.temp_output_toggle();
    return;
  }
 }
}).mount('#calc');