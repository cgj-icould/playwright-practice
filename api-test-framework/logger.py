import sys
from loguru import logger

# 移除默认的控制台输出，重新配置格式
logger.remove()
# 输出到控制台（带颜色）
logger.add(sys.stdout, format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{message}</cyan>")
# 输出到文件（每天一个文件，保留 7 天）
logger.add("logs/test_{time:YYYY-MM-DD}.log", rotation="00:00", retention="7 days", encoding="utf-8")