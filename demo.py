#Sittie Melhayah Amerol - MSIT 132 Session 1
# demo.py
data = [1, 2, 3, 4, 5]

square = lambda x: x * x
is_even = lambda x: x % 2 == 0

result = list(map(square, filter(is_even, data)))
print("Squared even numbers:", result)
