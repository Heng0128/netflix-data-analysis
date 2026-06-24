import os
import re
import json

charts_dir = 'charts'

def add_dark_background(content):
    """添加深色背景样式"""
    bg_style = '''<style>
body {
    margin: 0;
    padding: 20px;
    background: #080808;
    min-height: 100vh;
    box-sizing: border-box;
}
.chart-container {
    background: rgba(18, 18, 18, 0.75);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    padding: 16px;
    box-sizing: border-box;
}
</style>'''
    
    if bg_style in content:
        return content, False
    
    if '<body >' in content:
        return content.replace('<body >', '<body >\n' + bg_style), True
    elif '<body>' in content:
        return content.replace('<body>', '<body>\n' + bg_style), True
    return content, False

def fix_chart_file(filepath):
    """修复单个图表文件"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    changed = False
    
    # 1. 添加深色背景
    content, bg_changed = add_dark_background(content)
    if bg_changed:
        changed = True
    
    # 2. 找到所有 option 变量并修复
    # 匹配模式: var option_xxx = { ... };
    # 由于 JSON 可能很复杂，我们用一种特殊的方式处理
    
    # 找到所有的 option 变量名
    option_vars = re.findall(r'var\s+(option_[a-f0-9]+)\s*=\s*', content)
    
    for var_name in option_vars:
        # 提取这个变量的 JSON 内容
        # 找到变量定义的位置
        pattern = rf'var\s+{var_name}\s*=\s*(\{{[\s\S]*?\n\}});'
        match = re.search(pattern, content)
        if not match:
            continue
        
        json_str = match.group(1)
        try:
            option = json.loads(json_str)
            option_changed = False
            
            # 处理 series
            series_list = option.get('series', [])
            if isinstance(series_list, dict):
                series_list = [series_list]
            
            for series in series_list:
                series_type = series.get('type', '')
                
                # 修复折线图
                if series_type == 'line':
                    # 修复 lineStyle.show = false
                    line_style = series.get('lineStyle', {})
                    if line_style.get('show') is False:
                        line_style['show'] = True
                        series['lineStyle'] = line_style
                        option_changed = True
                    
                    # 修复数据格式：category xAxis + 二维数组数据 -> 一维数组
                    data = series.get('data', [])
                    if data and isinstance(data[0], list) and len(data[0]) == 2:
                        # 检查 xAxis 类型
                        xAxis = option.get('xAxis', [])
                        if isinstance(xAxis, list) and xAxis:
                            xAxis = xAxis[0]
                        elif isinstance(xAxis, dict):
                            pass
                        else:
                            xAxis = {}
                        
                        xAxis_type = xAxis.get('type', 'category')
                        xAxis_data = xAxis.get('data', [])
                        
                        if xAxis_type == 'category' and xAxis_data:
                            # 转换为一维数组
                            series['data'] = [item[1] for item in data]
                            option_changed = True
            
            if option_changed:
                # 序列化回 JSON
                new_json = json.dumps(option, ensure_ascii=False, indent=4)
                # 替换原文
                old_str = match.group(0)
                new_str = f'var {var_name} = {new_json};'
                content = content.replace(old_str, new_str)
                changed = True
                
        except json.JSONDecodeError as e:
            print(f"  JSON parse error in {var_name}: {e}")
            continue
    
    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    fixed_files = []
    for filename in sorted(os.listdir(charts_dir)):
        if not filename.endswith('.html'):
            continue
        filepath = os.path.join(charts_dir, filename)
        if fix_chart_file(filepath):
            fixed_files.append(filename)
            print(f'Fixed: {filename}')
    
    print(f'\nTotal fixed: {len(fixed_files)} files')

if __name__ == '__main__':
    main()
