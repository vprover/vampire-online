fof(pel47_1_1,axiom,
    ( ! [X] :
        ( wolf(X)
       => animal(X) ) )).

fof(pel47_1_2,axiom,
    ( ? [X1] : wolf(X1) )).

fof(pel47_2_1,axiom,
    ( ! [X] :
        ( fox(X)
       => animal(X) ) )).

fof(pel47_2_2,axiom,
    ( ? [X1] : fox(X1) )).

fof(pel47_3_1,axiom,
    ( ! [X] :
        ( bird(X)
       => animal(X) ) )).

fof(pel47_3_2,axiom,
    ( ? [X1] : bird(X1) )).

fof(pel47_4_1,axiom,
    ( ! [X] :
        ( caterpillar(X)
       => animal(X) ) )).

fof(pel47_4_2,axiom,
    ( ? [X1] : caterpillar(X1) )).

fof(pel47_5_1,axiom,
    ( ! [X] :
        ( snail(X)
       => animal(X) ) )).

fof(pel47_5_2,axiom,
    ( ? [X1] : snail(X1) )).

fof(pel47_6_1,axiom,
    ( ? [X] : grain(X) )).

fof(pel47_6_2,axiom,
    ( ! [X1] :
        ( grain(X1)
       => plant(X1) ) )).

fof(pel47_7,axiom,
    ( ! [X] :
        ( animal(X)
       => ( ! [Y] :
              ( plant(Y)
             => eats(X,Y) )
          | ! [Y1] :
              ( ( animal(Y1)
                & much_smaller(Y1,X)
                & ? [Z] :
                    ( plant(Z)
                    & eats(Y1,Z) ) )
             => eats(X,Y1) ) ) ) )).

fof(pel47_8,axiom,
    ( ! [X,Y] :
        ( ( bird(Y)
          & ( snail(X)
            | caterpillar(X) ) )
       => much_smaller(X,Y) ) )).

fof(pel47_9,axiom,
    ( ! [X,Y] :
        ( ( bird(X)
          & fox(Y) )
       => much_smaller(X,Y) ) )).

fof(pel47_10,axiom,
    ( ! [X,Y] :
        ( ( fox(X)
          & wolf(Y) )
       => much_smaller(X,Y) ) )).

fof(pel47_11,axiom,
    ( ! [X,Y] :
        ( ( wolf(X)
          & ( fox(Y)
            | grain(Y) ) )
       => ~ eats(X,Y) ) )).

fof(pel47_12,axiom,
    ( ! [X,Y] :
        ( ( bird(X)
          & caterpillar(Y) )
       => eats(X,Y) ) )).

fof(pel47_13,axiom,
    ( ! [X,Y] :
        ( ( bird(X)
          & snail(Y) )
       => ~ eats(X,Y) ) )).

fof(pel47_14,axiom,
    ( ! [X] :
        ( ( caterpillar(X)
          | snail(X) )
       => ? [Y] :
            ( plant(Y)
            & eats(X,Y) ) ) )).

fof(pel47,conjecture,
    ( ? [X,Y] :
        ( animal(X)
        & animal(Y)
        & ? [Z] :
            ( grain(Z)
            & eats(Y,Z)
            & eats(X,Y) ) ) )).