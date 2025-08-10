"""
Arithmetic processor for handling sign language calculator logic
"""

class ArithmeticProcessor:
    """Handles the arithmetic calculation logic and state management"""
    
    def __init__(self):
        self.reset()
    
    def reset(self):
        """Reset the calculator state"""
        self.state = {
            "current_state": "WAIT_FIRST_NUM",
            "number_1": None,
            "operator": None,
            "number_2": None,
            "result": None
        }
    
    def get_state(self):
        """Get current calculator state"""
        return self.state.copy()
    
    def process_input(self, detected_class, operator_map):
        """Process a detected class and update state accordingly"""
        
        # Handle reset command
        if detected_class == 'Start':
            self.reset()
            return self.state.copy()
        
        # Handle undefined gestures
        if detected_class == 'Undefined':
            return self.state.copy()
        
        is_operator = detected_class in operator_map
        is_digit = detected_class.isdigit()
        
        # State machine logic
        if self.state["current_state"] == "WAIT_FIRST_NUM":
            if is_digit:
                self.state["number_1"] = int(detected_class)
                self.state["current_state"] = "WAIT_OPERATOR"
        
        elif self.state["current_state"] == "WAIT_OPERATOR":
            if is_operator:
                self.state["operator"] = operator_map[detected_class]
                self.state["current_state"] = "WAIT_SECOND_NUM"
            elif is_digit:  # Allow overwriting first number
                self.state["number_1"] = int(detected_class)
        
        elif self.state["current_state"] == "WAIT_SECOND_NUM":
            if is_digit:
                self.state["number_2"] = int(detected_class)
                # Perform calculation
                self._calculate()
                self.state["current_state"] = "SHOWING_RESULT"
            elif is_operator:  # Allow overwriting operator
                self.state["operator"] = operator_map[detected_class]
        
        return self.state.copy()
    
    def _calculate(self):
        """Perform the arithmetic calculation"""
        try:
            num1 = self.state["number_1"]
            op = self.state["operator"]
            num2 = self.state["number_2"]
            
            if all(x is not None for x in [num1, op, num2]):
                if op == "+":
                    self.state["result"] = num1 + num2
                elif op == "-":
                    self.state["result"] = num1 - num2
                elif op == "*":
                    self.state["result"] = num1 * num2
                elif op == "/":
                    if num2 != 0:
                        self.state["result"] = num1 / num2
                    else:
                        self.state["result"] = "Error"
                else:
                    self.state["result"] = "Invalid"
            
        except Exception:
            self.state["result"] = "Error"
    
    def get_status_message(self):
        """Get a user-friendly status message"""
        state = self.state["current_state"]
        
        if state == "WAIT_FIRST_NUM":
            return "Please show the first number (0-9)."
        elif state == "WAIT_OPERATOR":
            return f"Got it: {self.state['number_1']}. Now show an operator."
        elif state == "WAIT_SECOND_NUM":
            return f"OK: {self.state['number_1']} {self.state['operator']}. Now show the second number."
        elif state == "SHOWING_RESULT":
            return "Calculation complete! Show 'Start' to reset."
        else:
            return "Ready to start."