# Tutorial demo

## Basic code and text

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin tincidunt quis ex at tempus. Donec tincidunt neque et bibendum placerat. Fusce purus tellus, vestibulum sit amet sem nec, finibus laoreet dui. Integer at lectus sodales, rutrum purus et, porta ex. Maecenas consequat lacus est, malesuada tincidunt nulla vulputate a. Etiam nec neque orci. Duis gravida iaculis tincidunt. Quisque sit amet odio pharetra, elementum odio et, ornare nisl. Fusce diam libero, vestibulum quis nisl nec, condimentum varius dui.  

Donec nunc quam, rutrum pulvinar imperdiet eget, pellentesque sed nibh. Aenean in tristique urna. Quisque semper libero justo, eget aliquet mi mattis eu. Donec vel scelerisque arcu. Integer odio libero, viverra a nunc sed, congue porta massa. Vivamus finibus tellus aliquam, hendrerit mi sed, eleifend orci. Nullam sed elit non felis semper ultrices. Sed id congue dui, a varius erat. Duis ut est posuere sem blandit feugiat. Praesent euismod egestas metus, ut rhoncus lorem pharetra eu. Fusce a molestie massa. In commodo risus et libero vestibulum interdum. Nam ultricies nulla mi, non pellentesque quam ultricies non. Maecenas finibus quam ipsum, vulputate iaculis elit malesuada et. Nulla luctus, libero eu consequat sollicitudin, sem nisi scelerisque nunc, et posuere libero elit in lacus. Suspendisse ut magna id augue tincidunt pellentesque.  

```
--time_limit 6 --mode portfolio
fof(one,axiom, ![X] : (rich(X) => happy(X))).
fof(two,axiom, rich(giles)).
fof(three, conjecture, happy(giles)).
```

## Learning TPTP syntax
We could deliberately give erroneous input and disable parsing in the editor if we're teaching a user the syntax.

Integer nec pellentesque tortor, eget consequat justo. Praesent sit amet velit dui. Donec euismod elit sagittis dui commodo auctor. Vivamus faucibus tellus at diam congue, porta dignissim augue tristique. Nam nisl eros, commodo nec sem id, dapibus interdum turpis. Cras ut interdum nisl, sit amet imperdiet quam. Mauris fermentum, sem quis dignissim pharetra, tellus nulla efficitur odio, eget volutpat elit ex vitae nibh. Vivamus semper et tellus sit amet dignissim. Phasellus risus elit, accumsan sed enim at, varius rutrum leo.

```noparse
fof(one,axiom, ![X] : (rich(X => happy(X))).
fof(two,conjecture, rich(giles)).
fof(three, conjecture, happy(giles)).
```

## A large input example
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eleifend accumsan tortor, a rutrum risus iaculis et. Quisque auctor mattis.

```
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
```
