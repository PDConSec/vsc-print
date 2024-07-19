# PlantUML

## Test of preprocessing include functionality

```plantuml
!include classA.iuml
!include classB.iuml

Class_A::method1 .r.> Class_B::field3
Class_A::method2 .r.> Class_B::field4
Class_B::method3 .r.> Class_A::field2
Class_B::method4 .r.> Class_A::field1
```