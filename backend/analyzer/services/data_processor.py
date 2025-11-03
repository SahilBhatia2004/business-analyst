import pandas as pd
import io
from supabase import create_client
from django.conf import settings


class DataProcessor:
    """Service to process data files and execute SQL queries"""
    
    def __init__(self):
        self.supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        self.column_mapping = {}  # Store original to cleaned column name mapping
    
    @staticmethod
    def clean_column_name(col_name):
        """
        Clean column name by removing spaces and special characters
        
        Args:
            col_name: Original column name
        
        Returns:
            Cleaned column name (lowercase, no spaces, no special chars)
        """
        import re
        # Convert to lowercase and replace spaces/special chars with underscores
        cleaned = col_name.lower()
        cleaned = re.sub(r'[\s\-\(\)\,\.\[\]\{\}\+\=\!\@\#\$\%\^\&\*\;\:\'\"\<\>\?\/\\\|\`\~]+', '_', cleaned)
        # Remove leading/trailing underscores and collapse multiple underscores
        cleaned = re.sub(r'_+', '_', cleaned).strip('_')
        return cleaned
    
    def load_file_from_supabase(self, file_path):
        """
        Load a file from Supabase storage
        
        Args:
            file_path: Path to the file in Supabase storage
        
        Returns:
            pandas DataFrame
        """
        try:
            # Download file from Supabase
            response = self.supabase.storage.from_('files').download(file_path)
            
            # Determine file type and load accordingly
            if file_path.endswith('.csv'):
                df = pd.read_csv(io.BytesIO(response))
            elif file_path.endswith(('.xlsx', '.xls')):
                df = pd.read_excel(io.BytesIO(response))
            else:
                raise ValueError(f"Unsupported file type: {file_path}")
            
            # Debug: Print loaded data
            print(f"Loaded file: {file_path}")
            print(f"Original columns: {df.columns.tolist()}")
            
            # Clean column names immediately
            original_columns = df.columns.tolist()
            cleaned_columns = [self.clean_column_name(col) for col in original_columns]
            
            # Store mapping for reference
            self.column_mapping = {orig: clean for orig, clean in zip(original_columns, cleaned_columns)}
            
            # Rename columns in DataFrame
            df.columns = cleaned_columns
            
            print(f"Cleaned columns: {df.columns.tolist()}")
            print(f"Column mapping: {self.column_mapping}")
            print(f"Data types:\n{df.dtypes}")
            print(f"First 3 rows:\n{df.head(3)}")
            
            return df
        except Exception as e:
            raise Exception(f"Error loading file {file_path}: {str(e)}")
    
    def get_schema_info(self, df):
        """
        Extract schema information from DataFrame
        Note: Column names in df are already cleaned (no spaces or special chars)
        
        Args:
            df: pandas DataFrame with cleaned column names
        
        Returns:
            Schema information as a string
        """
        schema_lines = ["Table: data"]
        schema_lines.append("Columns (cleaned names - no spaces or special characters):")
        
        for col in df.columns:
            dtype = str(df[col].dtype)
            sample_values = df[col].dropna().head(3).tolist()
            schema_lines.append(f"  - {col} ({dtype}) - Sample: {sample_values}")
        
        return "\n".join(schema_lines)
    
    def execute_sql_on_dataframe(self, df, sql_query):
        """
        Execute SQL query on pandas DataFrame
        Note: Column names in df are already cleaned (no spaces or special chars)
        
        Args:
            df: pandas DataFrame with cleaned column names
            sql_query: SQL query string (should use cleaned column names)
        
        Returns:
            Query results as pandas DataFrame with cleaned column names
        """
        try:
            import sqlite3
            import re
            
            # Create in-memory SQLite database
            conn = sqlite3.connect(':memory:')
            
            # Debug: Print DataFrame info before loading
            print(f"DataFrame columns (already cleaned): {df.columns.tolist()}")
            print(f"DataFrame shape: {df.shape}")
            print(f"First few rows:\n{df.head()}")
            
            # Write DataFrame to SQL (columns are already cleaned)
            df.to_sql('data', conn, index=False, if_exists='replace')
            
            try:
                # Clean up SQL query - remove quotes around table name
                safe_query = sql_query.replace('"data"', 'data')
                
                print(f"Original SQL: {sql_query}")
                print(f"Cleaned SQL: {safe_query}")
                
                # Execute query
                result_df = pd.read_sql_query(safe_query, conn)
                
                print(f"Result columns: {result_df.columns.tolist()}")
                print(f"Result data:\n{result_df}")
            except Exception as query_error:
                conn.close()
                raise Exception(f"Error executing SQL query: {str(query_error)}")
            
            conn.close()
            
            return result_df
        except Exception as e:
            raise Exception(f"Error executing SQL query: {str(e)}")
    
    def get_results_summary(self, df):
        """
        Generate a summary of query results
        
        Args:
            df: pandas DataFrame with query results
        
        Returns:
            Summary string
        """
        summary_lines = []
        summary_lines.append(f"Total rows: {len(df)}")
        summary_lines.append(f"Columns: {', '.join(df.columns.tolist())}")
        
        # Add sample data
        if len(df) > 0:
            summary_lines.append("\nSample data:")
            summary_lines.append(df.head(5).to_string())
        
        # Add basic statistics for numeric columns
        numeric_cols = df.select_dtypes(include=['number']).columns
        if len(numeric_cols) > 0:
            summary_lines.append("\nNumeric summary:")
            summary_lines.append(df[numeric_cols].describe().to_string())
        
        return "\n".join(summary_lines)
