"""
Test script to verify column name cleaning functionality
"""
import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from analyzer.services.data_processor import DataProcessor

# Test cases for column name cleaning
test_cases = [
    ("Employee Name", "employee_name"),
    ("Department Name", "department_name"),
    ("Employee Salary", "employee_salary"),
    ("Total Sales ($)", "total_sales"),
    ("Year-Month", "year_month"),
    ("Product (Category)", "product_category"),
    ("Email@Address", "email_address"),
    ("First Name, Last Name", "first_name_last_name"),
    ("Revenue [2024]", "revenue_2024"),
    ("Cost/Unit", "cost_unit"),
    ("Profit & Loss", "profit_loss"),
    ("Q1 Sales", "q1_sales"),
    ("  Leading Spaces  ", "leading_spaces"),
    ("Multiple   Spaces", "multiple_spaces"),
    ("Special!@#$%Chars", "special_chars"),
]

print("Testing Column Name Cleaning")
print("=" * 60)

all_passed = True
for original, expected in test_cases:
    cleaned = DataProcessor.clean_column_name(original)
    passed = cleaned == expected
    all_passed = all_passed and passed
    
    status = "✓ PASS" if passed else "✗ FAIL"
    print(f"{status} | '{original}' -> '{cleaned}'")
    if not passed:
        print(f"       Expected: '{expected}'")

print("=" * 60)
if all_passed:
    print("All tests passed! ✓")
else:
    print("Some tests failed! ✗")

print("\nExample DataFrame column cleaning:")
print("-" * 60)
import pandas as pd

# Create a sample DataFrame with problematic column names
df = pd.DataFrame({
    "Employee Name": ["John Doe", "Jane Smith"],
    "Department Name": ["Sales", "Engineering"],
    "Employee Salary": [50000, 75000],
    "Years of Experience": [3, 5]
})

print("Original columns:")
print(df.columns.tolist())

# Clean the columns using the static method
cleaned_columns = [DataProcessor.clean_column_name(col) for col in df.columns]
df.columns = cleaned_columns

print("\nCleaned columns:")
print(df.columns.tolist())

print("\nDataFrame with cleaned columns:")
print(df)
