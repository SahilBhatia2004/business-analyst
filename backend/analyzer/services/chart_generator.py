import plotly.graph_objects as go
import plotly.express as px
import pandas as pd


class ChartGenerator:
    """Service to generate Plotly charts from data"""
    
    def generate_chart(self, df, chart_type, title=""):
        """
        Generate a Plotly chart based on data and chart type
        
        Args:
            df: pandas DataFrame with query results
            chart_type: Type of chart (bar, pie, line, table, etc.)
            title: Chart title
        
        Returns:
            Dictionary with chart data in Plotly format
        """
        chart_type = chart_type.lower().strip()
        
        if 'bar' in chart_type:
            return self._generate_bar_chart(df, title)
        elif 'pie' in chart_type:
            return self._generate_pie_chart(df, title)
        elif 'line' in chart_type:
            return self._generate_line_chart(df, title)
        elif 'scatter' in chart_type:
            return self._generate_scatter_chart(df, title)
        elif 'table' in chart_type:
            return self._generate_table(df)
        else:
            # Default to bar chart
            return self._generate_bar_chart(df, title)
    
    def _generate_bar_chart(self, df, title):
        """Generate a bar chart"""
        # Debug logging
        print(f"Bar chart - DataFrame columns: {df.columns.tolist()}")
        print(f"Bar chart - DataFrame shape: {df.shape}")
        print(f"Bar chart - DataFrame data:\n{df}")
        
        if len(df.columns) < 2:
            # Handle single column case - try to create a meaningful chart
            if len(df.columns) == 1 and len(df) == 1:
                # Single value result (e.g., COUNT(*) = 500)
                col_name = df.columns[0]
                value = df.iloc[0, 0]
                
                # Create a simple bar chart with the aggregate result
                return {
                    'type': 'bar',
                    'data': {
                        'x': [str(col_name)],
                        'y': [value],
                        'marker': {
                            'color': '#22c55e',
                            'line': {'color': '#16a34a', 'width': 1}
                        },
                        'name': str(col_name)
                    },
                    'layout': {
                        'title': title,
                        'xaxis': {'title': 'Metric'},
                        'yaxis': {'title': 'Value'}
                    }
                }
            elif len(df.columns) == 1 and len(df) > 1:
                # Multiple rows, single column - use index as x-axis
                col_name = df.columns[0]
                x_data = [f"Row {i+1}" for i in range(len(df))]
                y_data = df.iloc[:, 0].tolist()
                
                return {
                    'type': 'bar',
                    'data': {
                        'x': x_data,
                        'y': y_data,
                        'marker': {
                            'color': '#22c55e',
                            'line': {'color': '#16a34a', 'width': 1}
                        },
                        'name': str(col_name)
                    },
                    'layout': {
                        'title': title,
                        'xaxis': {'title': 'Category'},
                        'yaxis': {'title': str(col_name)}
                    }
                }
            else:
                raise ValueError("Bar chart requires at least 2 columns or meaningful single column data")
        
        # Use iloc to safely access columns regardless of name format
        x_col = df.columns[0]
        y_col = df.columns[1]
        
        # Use iloc for safe column access
        x_data = df.iloc[:, 0].tolist()
        y_data = df.iloc[:, 1].tolist()
        
        print(f"Bar chart - x_data: {x_data}")
        print(f"Bar chart - y_data: {y_data}")
        
        return {
            'type': 'bar',
            'data': {
                'x': x_data,
                'y': y_data,
                'marker': {
                    'color': '#22c55e',
                    'line': {'color': '#16a34a', 'width': 1}
                },
                'name': str(y_col)
            },
            'layout': {
                'title': title,
                'xaxis': {'title': str(x_col)},
                'yaxis': {'title': str(y_col)}
            }
        }
    
    def _generate_pie_chart(self, df, title):
        """Generate a pie chart"""
        # Debug logging
        print(f"Pie chart - DataFrame columns: {df.columns.tolist()}")
        print(f"Pie chart - DataFrame shape: {df.shape}")
        print(f"Pie chart - DataFrame data:\n{df}")
        
        if len(df.columns) < 2:
            # Handle single column case
            if len(df.columns) == 1 and len(df) > 1:
                # Multiple rows, single column - use index as labels
                col_name = df.columns[0]
                labels_data = [f"Row {i+1}" for i in range(len(df))]
                values_data = df.iloc[:, 0].tolist()
                
                return {
                    'type': 'pie',
                    'data': {
                        'labels': labels_data,
                        'values': values_data,
                        'marker': {
                            'colors': px.colors.qualitative.Set3
                        },
                        'textinfo': 'label+percent',
                        'hoverinfo': 'label+value+percent'
                    },
                    'layout': {
                        'title': title
                    }
                }
            else:
                raise ValueError("Pie chart requires at least 2 columns or multiple rows with meaningful data")
        
        labels_col = df.columns[0]
        values_col = df.columns[1]
        
        # Use iloc for safe column access
        labels_data = df.iloc[:, 0].tolist()
        values_data = df.iloc[:, 1].tolist()
        
        print(f"Pie chart - labels: {labels_data}")
        print(f"Pie chart - values: {values_data}")
        
        return {
            'type': 'pie',
            'data': {
                'labels': labels_data,
                'values': values_data,
                'marker': {
                    'colors': px.colors.qualitative.Set3
                },
                'textinfo': 'label+percent',
                'hoverinfo': 'label+value+percent'
            },
            'layout': {
                'title': title
            }
        }
    
    def _generate_line_chart(self, df, title):
        """Generate a line chart"""
        if len(df.columns) < 2:
            raise ValueError("Line chart requires at least 2 columns")
        
        x_col = df.columns[0]
        y_col = df.columns[1]
        
        # Use iloc for safe column access
        x_data = df.iloc[:, 0].tolist()
        y_data = df.iloc[:, 1].tolist()
        
        return {
            'type': 'line',
            'data': {
                'x': x_data,
                'y': y_data,
                'mode': 'lines+markers',
                'marker': {'color': '#22c55e', 'size': 8},
                'line': {'color': '#22c55e', 'width': 2},
                'name': str(y_col)
            },
            'layout': {
                'title': title,
                'xaxis': {'title': str(x_col)},
                'yaxis': {'title': str(y_col)}
            }
        }
    
    def _generate_scatter_chart(self, df, title):
        """Generate a scatter chart"""
        if len(df.columns) < 2:
            raise ValueError("Scatter chart requires at least 2 columns")
        
        x_col = df.columns[0]
        y_col = df.columns[1]
        
        # Use iloc for safe column access
        x_data = df.iloc[:, 0].tolist()
        y_data = df.iloc[:, 1].tolist()
        
        return {
            'type': 'scatter',
            'data': {
                'x': x_data,
                'y': y_data,
                'mode': 'markers',
                'marker': {
                    'color': '#22c55e',
                    'size': 10,
                    'line': {'color': '#16a34a', 'width': 1}
                },
                'name': str(y_col)
            },
            'layout': {
                'title': title,
                'xaxis': {'title': str(x_col)},
                'yaxis': {'title': str(y_col)}
            }
        }
    
    def _generate_table(self, df):
        """Generate a table view"""
        return {
            'type': 'table',
            'data': {
                'columns': df.columns.tolist(),
                'rows': df.values.tolist()
            }
        }
