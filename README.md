# Koch snowflake

To draw a Koch snowflake, start with an equilateral triangle and then
break each line segment into thirds, replacing the middle third with
the other two sides of an equilateral triangle pointing out. Repeat
this process forever (or until you get bored).

How does the appearance of the Koch snowflake (or, more precisely, an
approximation to it of a few iterations) change when the triangle used
to replace the missing segment is not equilateral. In one limit the
line segment is replaced with a straight line so a single triangle
results. In another limit the middle "third" has length 0 and is
replaced by a perpendicular spike (which is then split on both sides).
This program draws everything in between.
