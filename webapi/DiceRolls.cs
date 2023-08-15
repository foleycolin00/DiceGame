namespace webapi;

public class DiceRolls
{
    public Dice[] dice { get; set; } = new Dice[0];

    public int numberOfRolls { get; set; }
    public Dictionary<int, double> rolls { get; set; } = new Dictionary<int, double>();

    public long elapsedMilliseconds { get; set; }
}

public class DiceInput
{
    public Dice[] dice { get; set; } = new Dice[0];

    public int numberOfRolls { get; set; }
}

public class Dice
{
    public int faces { get; set; }
    public int favored { get; set; }
    public int favoredFactor { get; set; }
}